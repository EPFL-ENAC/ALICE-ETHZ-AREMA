<template>
  <q-page>
    <div class="text-h5 q-pa-md">{{ t('building_materials') }}</div>
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
        </template>
        <template v-slot:body-cell-types="props">
          <q-td :props="props">
            <q-badge
              color="accent"
              v-for="type in props.value"
              :key="type"
              :label="type"
              class="q-mr-sm"
            />
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

      <building-material-dialog
        v-if="selected"
        v-model="showEditDialog"
        :item="selected"
        @saved="onSaved"
      ></building-material-dialog>
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
import type { BuildingMaterial } from 'src/models';
import BuildingMaterialDialog from 'src/components/BuildingMaterialDialog.vue';
import ConfirmDialog from 'src/components/ConfirmDialog.vue';
import { makePaginationRequestHandler } from 'src/utils/pagination';
import type { PaginationOptions } from 'src/utils/pagination';
import { toDatetimeString, isDatetimeBefore } from 'src/utils/time';
import { notifyError, notifySuccess } from 'src/utils/notify';
import type { Alignment } from 'src/components/models';

const { t } = useI18n({ useScope: 'global' });
const authStore = useAuthStore();
const taxonomyStore = useTaxonomyStore();
const services = useServices();
const service = services.make('building-material');

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
      name: 'types',
      required: true,
      label: t('types'),
      align: 'left' as Alignment,
      field: 'types',
      format: (val: string[] | undefined) => (val ? val.map(getTypeLabel) : []),
      sortable: true,
    },
    {
      name: 'natural_resources',
      required: true,
      label: t('natural_resources'),
      align: 'left' as Alignment,
      field: (row: BuildingMaterial) => {
        return row.natural_resources ? row.natural_resources.map((nr) => nr.name).join(', ') : '-';
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

const selected = ref<BuildingMaterial>();
const showEditDialog = ref(false);
const showConfirmDialog = ref(false);
const tableRef = ref();
const rows = ref<BuildingMaterial[]>([]);
const filter = ref('');
const loading = ref(false);
const pagination = ref<PaginationOptions>({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 50,
});
const bmTypes = ref<Option[]>([]);

onMounted(() => {
  // get initial data from server (1st page)
  tableRef.value.requestServerInteraction();
  void taxonomyStore.getTaxonomyNode('building-material', 'type').then((types) => {
    if (!types) {
      console.warn('No taxonomy found for building-material type');
      return;
    }
    bmTypes.value = taxonomyStore.asOptions('building-material', types, 'type');
  });
});

function fetchFromServer(
  startRow: number,
  count: number,
  sortBy: string,
  descending: boolean,
  filter?: string,
) {
  const query: Query = {
    $skip: startRow,
    $limit: count,
    $sort: [sortBy, descending],
  };
  if (filter) {
    query.filter = {
      name: { $ilike: `%${filter}%` },
    };
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

function onEdit(item: BuildingMaterial) {
  selected.value = { ...item };
  showEditDialog.value = true;
}

function onTogglePublish(item: BuildingMaterial) {
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

function onRemove(item: BuildingMaterial) {
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
  return bmTypes.value.find((opt) => opt.value === val)?.label || val;
}
</script>
