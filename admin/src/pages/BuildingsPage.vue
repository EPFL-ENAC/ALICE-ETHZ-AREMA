<template>
  <q-page>
    <div class="text-h5 q-pa-md">{{ t('buildings') }}</div>
    <q-separator />
    <div class="q-pa-md">
      <q-table
        flat
        ref="tableRef"
        :rows="rows"
        :columns="columns"
        row-key="id"
        v-model:pagination="pagination"
        :loading="loading"
        :filter="filter"
        binary-state-sort
        @request="onRequest"
        :rows-per-page-options="[10, 25, 50, 0]"
      >
        <template v-slot:top>
          <q-btn
            v-if="authStore.isAdmin || authStore.isReviewer || authStore.isContributor"
            size="sm"
            color="primary"
            :disable="loading"
            :label="t('add')"
            icon="add"
            @click="onAdd"
          />
          <q-btn-dropdown
            v-if="authStore.isAdmin"
            size="sm"
            color="primary"
            :label="t('importer.import')"
            class="on-right"
          >
            <q-list>
              <q-item clickable v-close-popup @click="onShowIGLehmImport">
                <q-item-section>
                  <q-item-label>IG Lehm</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn
            v-if="authStore.isAdmin"
            size="sm"
            color="primary"
            :disable="loading"
            :label="t('index_all')"
            icon="manage_search"
            @click="onIndex"
            class="on-right"
          />
          <q-space />
          <q-input dense debounce="300" v-model="filter" clearable>
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <div style="width: 100%" class="q-mt-md">
            <map-view
              :features="features"
              :center="[6.632273, 46.519962]"
              :zoom="6"
              :minZoom="10"
              :maxZoom="18"
              height="300px"
            />
          </div>
        </template>
        <template v-slot:body-cell-type="props">
          <q-td :props="props">
            <q-badge color="accent" :label="props.value" />
          </q-td>
        </template>
        <template v-slot:body-cell-published="props">
          <q-td :props="props">
            <div
              :title="
                props.row.published_at === undefined
                  ? t('not_published')
                  : t('published_on', { date: toDatetimeString(props.row.published_at) })
              "
            >
              <q-icon name="star_outline" v-if="props.row.published_at === undefined" size="sm" />
              <q-icon
                name="star_half"
                v-else-if="isDatetimeBefore(props.row.published_at, props.row.updated_at)"
                size="sm"
              />
              <q-icon name="star" v-else size="sm" />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-state="props">
          <q-td :props="props">
            <entity-state-btn :entity="props.row" type="building" @state-changed="onRefresh" />
          </q-td>
        </template>
        <template v-slot:body-cell-assigned_to="props">
          <q-td :props="props">
            <entity-assignee-btn
              :entity="props.row"
              type="building"
              @assignee-changed="onRefresh"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <entity-actions-btn :entity="props.row" @action="onAction(props.row, $event)" />
          </q-td>
        </template>
      </q-table>

      <building-dialog
        v-if="selected"
        v-model="showEditDialog"
        :item="selected"
        :original="original"
        :read-only="readOnly"
        @saved="onRefresh"
      />

      <IGLehmProjectImporterDialog v-model="showIGLehmImporter" @import="onIGLehmImport" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import type { Option, Query } from 'src/components/models';
import type { Building } from 'src/models';
import { makePaginationRequestHandler } from 'src/utils/pagination';
import type { PaginationOptions } from '../utils/pagination';
import MapView from 'src/components/MapView.vue';
import BuildingDialog from 'src/components/BuildingDialog.vue';
import { toDatetimeString, isDatetimeBefore } from 'src/utils/time';
import { notifyError, notifySuccess } from 'src/utils/notify';
import type { Alignment } from 'src/components/models';
import type { Feature, Point, GeoJsonProperties } from 'geojson';
import EntityActionsBtn from 'src/components/EntityActionsBtn.vue';
import EntityStateBtn from 'src/components/EntityStateBtn.vue';
import EntityAssigneeBtn from 'src/components/EntityAssigneeBtn.vue';
import IGLehmProjectImporterDialog from 'src/components/importer/IGLehmProjectImporterDialog.vue';
import type { IGLehmProjectSummary, IGLehmProject } from 'src/models';

const { t } = useI18n({ useScope: 'global' });
const authStore = useAuthStore();
const taxonomyStore = useTaxonomyStore();
const importerService = useImporterService();
const services = useServices();
const service = services.make('building');

const columns = computed(() => {
  const cols = [
    {
      name: 'id',
      required: true,
      label: 'ID',
      align: 'left' as Alignment,
      field: 'id',
      style: 'min-width: 20px',
      sortable: true,
    },
    {
      name: 'name',
      required: true,
      label: t('name'),
      align: 'left' as Alignment,
      field: 'name',
      sortable: true,
    },
    {
      name: 'published',
      required: true,
      label: t('published'),
      align: 'left' as Alignment,
      field: 'published_at',
      sortable: false,
      style: 'min-width: 50px',
    },
    {
      name: 'state',
      required: true,
      label: t('state'),
      align: 'left' as Alignment,
      field: 'state',
      sortable: true,
      style: 'min-width: 120px',
    },
    {
      name: 'assigned_to',
      required: true,
      label: t('assigned_to'),
      align: 'left' as Alignment,
      field: 'assigned_to',
      sortable: true,
    },
    {
      name: 'type',
      required: true,
      label: t('type'),
      align: 'left' as Alignment,
      field: 'type',
      format: getTypeLabel,
      sortable: true,
    },
    {
      name: 'address',
      required: true,
      label: t('address'),
      align: 'left' as Alignment,
      field: 'address',
      sortable: false,
    },
    {
      name: 'building_materials',
      required: true,
      label: t('building_materials'),
      align: 'left' as Alignment,
      field: (row: Building) => {
        return row.building_materials
          ? row.building_materials.map((bm) => bm.name).join(', ')
          : '-';
      },
      sortable: false,
    },
    {
      name: 'building_elements',
      required: true,
      label: t('building_elements'),
      align: 'left' as Alignment,
      field: (row: Building) => {
        return row.building_elements?.length;
      },
      sortable: false,
    },
    {
      name: 'professionals',
      required: true,
      label: t('professionals'),
      align: 'left' as Alignment,
      field: (row: Building) => {
        return row.professionals ? row.professionals.map((pro) => pro.name).join(', ') : '-';
      },
      sortable: false,
    },
    {
      name: 'createdBy',
      required: true,
      label: t('created_by'),
      align: 'left' as Alignment,
      field: 'created_by',
      sortable: true,
    },
    {
      name: 'lastModification',
      required: true,
      label: t('last_modification'),
      align: 'left' as Alignment,
      field: 'updated_at',
      format: toDatetimeString,
      sortable: false,
    },
  ];

  if (authStore.isAdmin || authStore.isReviewer || authStore.isContributor) {
    cols.splice(2, 0, {
      name: 'action',
      align: 'right' as Alignment,
      label: '',
      field: 'action',
      required: false,
      sortable: false,
      style: 'min-width: 100px',
    });
  }

  return cols;
});

const selected = ref<Building>();
const original = ref<Building>();
const showEditDialog = ref(false);
const readOnly = ref(false);
const tableRef = ref();
const rows = ref<Building[]>([]);
const filter = ref('');
const loading = ref(false);
const pagination = ref<PaginationOptions>({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 50,
});
const bldTypes = ref<Option[]>([]);
const showIGLehmImporter = ref(false);

onMounted(() => {
  onRefresh();
  void taxonomyStore.getTaxonomyNode('building', 'type').then((types) => {
    if (!types) {
      console.warn('No taxonomy found for building type');
      return;
    }
    bldTypes.value = taxonomyStore.asOptions('building', types, 'type');
  });
});

const features = computed(() => {
  return rows.value.map((row) => {
    return {
      type: 'Feature',
      id: row.id,
      properties: {
        name: row.name,
        description: row.description,
        address: row.address,
      } as GeoJsonProperties,
      geometry: {
        type: 'Point',
        coordinates: [row.long, row.lat],
      } as Point,
    };
  }) as Feature<Point>[];
});

function fetchFromServer(
  startRow: number,
  count: number,
  sortBy: string,
  descending: boolean,
  filter?: string,
) {
  loading.value = true;
  const query: Query = {
    $skip: startRow,
    $limit: count,
    $sort: [sortBy, descending],
  };
  query.filter = {};
  if (authStore.isContributor) {
    query.filter.created_by = authStore.profile?.username || authStore.profile?.email || '';
  }
  if (filter) {
    query.filter.$or = [
      {
        name: {
          $ilike: `%${filter}%`,
        },
      },
      {
        address: {
          $ilike: `%${filter}%`,
        },
      },
    ];
  }
  return service
    .find(query)
    .then((result) => {
      rows.value = result.data;
      loading.value = false;
      return result;
    })
    .catch(notifyError);
}

const onRequest = makePaginationRequestHandler(fetchFromServer, pagination);

function onIndex() {
  loading.value = true;
  void service
    .index()
    .then((result) => {
      notifySuccess(t('all_items_indexed', { count: result }));
      onRefresh();
    })
    .catch(notifyError)
    .finally(() => {
      loading.value = false;
    });
}

function onAdd() {
  selected.value = { name: '' };
  original.value = undefined;
  showEditDialog.value = true;
}

function onRefresh() {
  tableRef.value.requestServerInteraction();
}

function onAction(item: Building, action: string) {
  switch (action) {
    case 'edit':
      onEdit(item);
      break;
    case 'view':
      onView(item);
      break;
    case 'publish':
      onPublish(item);
      break;
    case 'unpublish':
      onUnpublish(item);
      break;
    case 'remove':
      onRemove(item);
      break;
    case 'lock':
      onToggleLock(item);
      break;
    default:
      console.warn(`Unknown action: ${action}`);
  }
}

function onEdit(resource: Building) {
  selected.value = { ...resource };
  original.value = { ...resource };
  readOnly.value = false;
  showEditDialog.value = true;
}

function onView(resource: Building) {
  selected.value = { ...resource };
  original.value = undefined;
  readOnly.value = true;
  showEditDialog.value = true;
}

function onPublish(item: Building) {
  if (!item.id) return;
  void service.publish(item.id).then(onRefresh).catch(notifyError);
}

function onUnpublish(item: Building) {
  if (!item.id) return;
  void service.unpublish(item.id).then(onRefresh).catch(notifyError);
}

function onToggleLock(item: Building) {
  if (!item.id) return;
  void service
    .setState(item.id, item.state === 'locked' ? 'draft' : 'locked')
    .then(onRefresh)
    .catch(notifyError);
}

function onRemove(item: Building) {
  if (!item.id) return;
  void service.remove(item.id).then(onRefresh).catch(notifyError);
}

function getTypeLabel(val: string): string {
  return bldTypes.value.find((opt) => opt.value === val)?.label || val;
}

function onShowIGLehmImport() {
  showIGLehmImporter.value = true;
}

function onIGLehmImport(project: IGLehmProjectSummary | null) {
  if (!project) return;

  function list_to_md(title: string, list: string[] | undefined): string {
    if (!list || list.length === 0) {
      return '';
    }
    const md = `**${title}**\n`;
    return md + list.map((item) => `* ${item}`).join('\n');
  }

  void importerService
    .fetchIGLehmProject(project.cId)
    .then((data: IGLehmProject) => {
      const description = [
        list_to_md(t('importer.regions'), data.regions),
        list_to_md(t('importer.fields'), data.fields),
      ].join('\n\n');
      const project_building = {
        name: data.title,
        description: (data.content || '') + '\n\n' + description,
        article_top: data.description || '',
        external_links: data.pageUrl ? `[IG Lehm: ${data.title}](${data.pageUrl})` : '',
        address: data.location || '',
        year: data.yearOfConstruction ? Number(data.yearOfConstruction) : undefined,
        files: data.images
          ? data.images.map((image) => ({
              url: image.url,
              legend: image.description || '',
            }))
          : [],
        source: `iglehm:${data.cId}`,
      } as Building;
      if (data.building_id) {
        service
          .get(`${data.building_id}`)
          .then((building) => {
            selected.value = building as Building;
            original.value = JSON.parse(JSON.stringify(building)) as Building;
            // update building with IG Lehm data
            // except name and external_links which should be preserved
            selected.value.description = project_building.description || '';
            selected.value.article_top = project_building.article_top || '';
            selected.value.address = project_building.address || '';
            selected.value.year = project_building.year;
            if (project_building.files?.length) {
              // append files not already in building's file list
              const existingUrls = new Set(selected.value.files?.map((f) => f.url));
              const newFiles = project_building.files.filter((f) => !existingUrls.has(f.url));
              selected.value.files = [...(selected.value.files || []), ...newFiles];
            }
            showEditDialog.value = true;
          })
          .catch(notifyError);
      } else {
        selected.value = project_building;
        original.value = undefined;
        showEditDialog.value = true;
      }
    })
    .catch(notifyError);
}
</script>
