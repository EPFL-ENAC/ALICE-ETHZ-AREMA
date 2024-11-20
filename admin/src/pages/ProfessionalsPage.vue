<template>
  <q-page>
    <div class="text-h5 q-pa-md">{{ $t('professionals') }}</div>
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
          <q-select
            filled
            dense
            clearable
            v-model="types"
            :options="professionalTypes"
            :label="$t('type')"
            class="q-mr-md"
            style="min-width: 200px"
            @update:model-value="onTypeSelection"
            multiple
            emit-value
            map-options
          />
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
        <template v-slot:body-cell-web="props">
          <q-td :props="props">
            <a :href="props.value" target="_blank" class="epfl">{{
              props.value
            }}</a>
          </q-td>
        </template>
        <template v-slot:body-cell-address="props">
          <q-td :props="props" style="max-width: 200px; white-space: inherit">
            {{ props.value }}
          </q-td>
        </template>
        <template v-slot:body-cell-radius="props">
          <q-td :props="props">
            <q-chip size="sm">{{ props.value }} km</q-chip>
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

      <professional-dialog
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
import { Professional, Taxonomy, TaxonomyNode } from 'src/models';
import { makePaginationRequestHandler } from 'src/utils/pagination';
import type { PaginationOptions } from 'src/utils/pagination';
import MapView from 'src/components/MapView.vue';
import ProfessionalDialog from 'src/components/ProfessionalDialog.vue';
import { onMounted, ref, computed } from 'vue';

const { t } = useI18n({ useScope: 'global' });
const $q = useQuasar();
const authStore = useAuthStore();
const taxonomyStore = useTaxonomyStore();
const services = useServices();
const service = services.make('professional');
//const serviceType = services.make('professional-type');

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
      name: 'description',
      required: true,
      label: t('description'),
      align: 'left',
      field: 'description',
      sortable: false,
    },
    {
      name: 'type',
      required: true,
      label: t('type'),
      align: 'left',
      field: 'type',
      format: (val: string) => (val ? t(val) : undefined),
      sortable: true,
    },
    {
      name: 'web',
      required: true,
      label: t('website'),
      align: 'left',
      field: 'web',
      sortable: true,
    },
    {
      name: 'address',
      required: true,
      label: t('address'),
      align: 'left',
      field: 'address',
      sortable: true,
    },
    {
      name: 'radius',
      required: true,
      label: t('areaDelivery'),
      align: 'left',
      field: 'radius',
      sortable: false,
    },
    {
      name: 'building_materials',
      required: true,
      label: t('building_materials'),
      align: 'left',
      field: (row: Professional) => {
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
      field: (row: Professional) => {
        return row.technical_constructions
          ? row.technical_constructions.map((bm) => bm.name).join(', ')
          : '-';
      },
      sortable: false,
    },
    {
      name: 'lastModification',
      required: true,
      label: t('last_modification'),
      align: 'left',
      field: (row: Professional) => {
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

const selected = ref<Professional>();
const showEditDialog = ref(false);
const tableRef = ref();
const rows = ref<Professional[]>([]);
const types = ref<string[] | null>(null);
const filter = ref('');
const loading = ref(false);
const pagination = ref<PaginationOptions>({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
});
const professionalTypes = ref<{ value: string; label: string }[]>([]);

onMounted(() => {
  tableRef.value.requestServerInteraction();
  taxonomyStore.getTaxonomy('professional').then((taxo: Taxonomy) => {
    if (taxo.taxonomy[0].children) {
      professionalTypes.value = taxo.taxonomy[0].children.map(
        (node: TaxonomyNode) => {
          return {
            value: node.id,
            label: node.name,
          };
        },
      );
    } else {
      professionalTypes.value = [];
    }
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
        circleRadius: row.radius,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[asPoint(row), asPoint(row), asPoint(row), asPoint(row)]],
      },
    };
  });
});

function asPoint(professional: Professional) {
  return [professional.long, professional.lat];
}

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
  if (types.value) {
    query.filter = {
      type: {
        $in: types.value,
      },
    };
  }
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

function onTypeSelection() {
  tableRef.value.requestServerInteraction();
}

function onAdd() {
  selected.value = { name: '' };
  showEditDialog.value = true;
}

function onEdit(resource: Professional) {
  selected.value = { ...resource };
  showEditDialog.value = true;
}

function onSaved() {
  tableRef.value.requestServerInteraction();
}

function remove(resource: Professional) {
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
