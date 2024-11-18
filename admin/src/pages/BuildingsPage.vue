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
            color="primary"
            :disable="loading"
            :label="$t('add')"
            icon="add"
            @click="onAdd"
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
        <template v-slot:body-cell-description="props">
          <q-td :props="props" class="ellipsis" style="max-width: 200px">
            {{ props.value }}
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
import { Query } from 'src/components/models';
import { Building } from 'src/models';
import { makePaginationRequestHandler } from '../utils/pagination';
import type { PaginationOptions } from '../utils/pagination';
import MapView from 'src/components/MapView.vue';
import BuildingDialog from 'src/components/BuildingDialog.vue';

const { t } = useI18n({ useScope: 'global' });
const $q = useQuasar();
const authStore = useAuthStore();
const services = useServices();
const service = services.make('building');

const columns = computed(() => {
  const cols = [
    {
      name: 'name',
      required: true,
      label: t('name'),
      align: 'left',
      field: 'name',
      sortable: true,
    },
    {
      name: 'description',
      required: true,
      label: t('description'),
      align: 'left',
      field: 'description',
      sortable: false,
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
      name: 'technical_constructions',
      required: true,
      label: t('technical_constructions'),
      align: 'left',
      field: (row: Building) => {
        return row.technical_constructions
          ? row.technical_constructions.map((tc) => tc.name).join(', ')
          : '-';
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

onMounted(() => {
  // get initial data from server (1st page)
  tableRef.value.requestServerInteraction();
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
    $sort: {
      [sortBy]: descending ? -1 : 1,
    },
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
    .find({
      query,
    })
    .then((result) => {
      rows.value = result.data;
      loading.value = false;
      return result;
    });
}

const onRequest = makePaginationRequestHandler(fetchFromServer, pagination);

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
</script>
