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
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn
              color="grey-8"
              size="12px"
              flat
              dense
              round
              icon="edit"
              :title="t('edit')"
              @click="onEdit(props.row)"
            >
            </q-btn>
            <q-btn
              v-if="authStore.isAdmin"
              color="grey-8"
              size="12px"
              flat
              dense
              round
              icon="publish"
              :title="t('publish_unpublish')"
              @click="onTogglePublish(props.row)"
            >
            </q-btn>
            <q-btn
              v-if="authStore.isAdmin"
              color="grey-8"
              size="12px"
              flat
              dense
              round
              icon="delete"
              :title="t('remove')"
              @click="onRemove(props.row)"
            >
            </q-btn>
          </q-td>
        </template>
      </q-table>

      <building-dialog v-if="selected" v-model="showEditDialog" :item="selected" @saved="onSaved" />
      <confirm-dialog
        v-model="showConfirmDialog"
        :title="t('remove')"
        :text="t('confirm_remove', { name: selected?.name })"
        @confirm="remove()"
      />
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
import ConfirmDialog from 'src/components/ConfirmDialog.vue';
import { toDatetimeString, isDatetimeBefore } from 'src/utils/time';
import { notifyError, notifySuccess } from 'src/utils/notify';
import type { Alignment } from 'src/components/models';
import type { Feature, Point, GeoJsonProperties } from 'geojson';

const { t } = useI18n({ useScope: 'global' });
const authStore = useAuthStore();
const taxonomyStore = useTaxonomyStore();
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
      style: 'width: 20px',
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
      style: 'width: 50px',
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
      style: 'width: 100px',
    });
  }

  return cols;
});

const selected = ref<Building>();
const showEditDialog = ref(false);
const showConfirmDialog = ref(false);
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

onMounted(() => {
  tableRef.value.requestServerInteraction();
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
  if (filter) {
    if (!query.filter) query.filter = {};
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
      tableRef.value.requestServerInteraction();
    })
    .catch(notifyError)
    .finally(() => {
      loading.value = false;
    });
}

function onAdd() {
  selected.value = { name: '' };
  showEditDialog.value = true;
}

function onEdit(resource: Building) {
  selected.value = { ...resource };
  showEditDialog.value = true;
}

function onTogglePublish(item: Building) {
  if (!item.id) return;
  void service
    .togglePublish(item.id)
    .then(() => {
      tableRef.value.requestServerInteraction();
    })
    .catch(notifyError);
}

function onSaved() {
  tableRef.value.requestServerInteraction();
}

function onRemove(item: Building) {
  selected.value = item;
  showConfirmDialog.value = true;
}

function remove() {
  if (!selected.value?.id) return;
  void service
    .remove(selected.value?.id)
    .then(() => {
      tableRef.value.requestServerInteraction();
    })
    .catch(notifyError);
}

function getTypeLabel(val: string): string {
  return bldTypes.value.find((opt) => opt.value === val)?.label || val;
}
</script>
