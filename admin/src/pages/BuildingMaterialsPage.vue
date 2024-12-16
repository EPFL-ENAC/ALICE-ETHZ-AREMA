<template>
  <q-page>
    <div class="text-h5 q-pa-md">{{ $t('building_materials') }}</div>
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
        :rows-per-page-options="[10, 25, 50]"
      >
        <template v-slot:top>
          <q-btn
            v-if="authStore.isAdmin"
            size="sm"
            color="primary"
            :disable="loading"
            :label="$t('add')"
            icon="add"
            @click="onAdd"
          />
          <q-btn
            v-if="authStore.isAdmin"
            size="sm"
            color="primary"
            :disable="loading"
            :label="$t('index_all')"
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
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn
              color="grey-8"
              size="12px"
              flat
              dense
              round
              icon="edit"
              @click="onEdit(props.row)"
            >
            </q-btn>
            <q-btn
              color="grey-8"
              size="12px"
              flat
              dense
              round
              icon="delete"
              @click="remove(props.row)"
            >
            </q-btn>
          </q-td>
        </template>
      </q-table>

      <building-material-dialog
        v-model="showEditDialog"
        :item="selected"
        @saved="onSaved"
      ></building-material-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { Option, Query } from 'src/components/models';
import { BuildingMaterial } from 'src/models';
import BuildingMaterialDialog from 'src/components/BuildingMaterialDialog.vue';
import { makePaginationRequestHandler } from '../utils/pagination';
import type { PaginationOptions } from '../utils/pagination';

const { t } = useI18n({ useScope: 'global' });
const $q = useQuasar();
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
      align: 'left',
      field: 'id',
      style: 'width: 20px',
      sortable: true,
    },
    {
      name: 'name',
      required: true,
      label: t('name'),
      align: 'left',
      field: 'name',
      sortable: true,
    },
    {
      name: 'types',
      required: true,
      label: t('types'),
      align: 'left',
      field: 'types',
      format: (val: string[] | undefined) => (val ? val.map(getTypeLabel) : []),
      sortable: true,
    },
    {
      name: 'natural_resources',
      required: true,
      label: t('natural_resources'),
      align: 'left',
      field: (row: BuildingMaterial) => {
        return row.natural_resources
          ? row.natural_resources.map((nr) => nr.name).join(', ')
          : '-';
      },
      sortable: false,
    },
    {
      name: 'lastModification',
      required: true,
      label: t('last_modification'),
      align: 'left',
      field: (row: BuildingMaterial) => {
        const date = new Date(row.updated_at || row.created_at || '');
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      },
      sortable: false,
    },
  ];

  if (authStore.isAdmin) {
    cols.push({
      name: 'action',
      align: 'left',
      label: t('action'),
    });
  }

  return cols;
});

const selected = ref<BuildingMaterial>();
const showEditDialog = ref(false);
const tableRef = ref();
const rows = ref<BuildingMaterial[]>([]);
const filter = ref('');
const loading = ref(false);
const pagination = ref<PaginationOptions>({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
});
const bmTypes = ref<Option[]>([]);

onMounted(() => {
  // get initial data from server (1st page)
  tableRef.value.requestServerInteraction();
  taxonomyStore.getTaxonomyNode('building-material', 'type').then((types) => {
    bmTypes.value = taxonomyStore.asOptions('building-material', types, 'type');
  });
});

function fetchFromServer(
  startRow: number,
  count: number,
  filter: string,
  sortBy: string,
  descending: boolean,
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
  return service.find(query).then((result) => {
    rows.value = result.data;
    loading.value = false;
    return result;
  });
}

const onRequest = makePaginationRequestHandler(fetchFromServer, pagination);

function onIndex() {
  loading.value = true;
  service
    .index()
    .then((result) => {
      $q.notify({
        message: t('all_items_indexed', { count: result }),
        type: 'positive',
      });
    })
    .catch((err) => {
      $q.notify({
        message: err.message,
        type: 'negative',
      });
    })
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

function onSaved() {
  tableRef.value.requestServerInteraction();
}

function remove(item: BuildingMaterial) {
  if (!item.id) return;
  service
    .remove(item.id)
    .then(() => {
      tableRef.value.requestServerInteraction();
    })
    .catch((err) => {
      $q.notify({
        message: err.message,
        type: 'negative',
      });
    });
}

function getTypeLabel(val: string): string {
  return bmTypes.value.find((opt) => opt.value === val)?.label || val;
}
</script>
