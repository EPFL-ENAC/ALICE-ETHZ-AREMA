<template>
  <q-page>
    <div class="text-h5 q-pa-md">{{ $t('buildings') }}</div>
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

      <building-dialog
        v-model="showEditDialog"
        :item="selected"
        @saved="onSaved"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { Option, Query } from 'src/components/models';
import { Building } from 'src/models';
import { makePaginationRequestHandler } from '../utils/pagination';
import type { PaginationOptions } from '../utils/pagination';
import MapView from 'src/components/MapView.vue';
import BuildingDialog from 'src/components/BuildingDialog.vue';

const { t } = useI18n({ useScope: 'global' });
const $q = useQuasar();
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
      name: 'type',
      required: true,
      label: t('type'),
      align: 'left',
      field: 'type',
      format: getTypeLabel,
      sortable: true,
    },
    {
      name: 'address',
      required: true,
      label: t('address'),
      align: 'left',
      field: 'address',
      sortable: false,
    },
    {
      name: 'building_materials',
      required: true,
      label: t('building_materials'),
      align: 'left',
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
      align: 'left',
      field: (row: Building) => {
        return row.building_elements?.length;
      },
      sortable: false,
    },
    {
      name: 'professionals',
      required: true,
      label: t('professionals'),
      align: 'left',
      field: (row: Building) => {
        return row.professionals
          ? row.professionals.map((pro) => pro.name).join(', ')
          : '-';
      },
      sortable: false,
    },
    {
      name: 'lastModification',
      required: true,
      label: t('last_modification'),
      align: 'left',
      field: (row: Building) => {
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

const selected = ref<Building>();
const showEditDialog = ref(false);
const tableRef = ref();
const rows = ref<Building[]>([]);
const filter = ref('');
const loading = ref(false);
const pagination = ref<PaginationOptions>({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
});
const bldTypes = ref<Option[]>([]);

onMounted(() => {
  tableRef.value.requestServerInteraction();
  taxonomyStore.getTaxonomyNode('building', 'type').then((types) => {
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
      },
      geometry: {
        type: 'Point',
        coordinates: [row.long, row.lat],
      },
    };
  });
});

function fetchFromServer(
  startRow: number,
  count: number,
  filter: string,
  sortBy: string,
  descending: boolean,
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

function onEdit(resource: Building) {
  selected.value = { ...resource };
  showEditDialog.value = true;
}

function onSaved() {
  tableRef.value.requestServerInteraction();
}

function remove(resource: Building) {
  if (!resource.id) return;
  service
    .remove(resource.id)
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
  return bldTypes.value.find((opt) => opt.value === val)?.label || val;
}
</script>
