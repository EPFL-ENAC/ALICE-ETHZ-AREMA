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
            color="primary"
            :disable="loading"
            :label="$t('add')"
            icon="add"
            @click="onAdd"
          />
          <q-space />
          <q-select
            filled
            clearable
            v-model="types"
            :options="professionalTypeOptions"
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
              height="300px"/>
          </div>
        </template>
        <template v-slot:body-cell-description="props">
          <q-td :props="props" class="ellipsis" style="max-width: 200px">
            {{ props.value }}
          </q-td>
        </template>
        <template v-slot:body-cell-web="props">
          <q-td :props="props">
            <a :href="props.value" target="_blank">{{ props.value }}</a>
          </q-td>
        </template>
        <template v-slot:body-cell-address="props">
          <q-td :props="props" style="max-width: 200px; white-space: inherit;">
            {{ props.value }}
          </q-td>
        </template>
        <template v-slot:body-cell-areaDelivery="props">
          <q-td :props="props">
            <q-chip>{{ props.value.radius }} km</q-chip>
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


      <q-dialog
        v-model="showEditDialog"
        persistent
        transition-show="scale"
        transition-hide="scale"
        full-width
      >
        <q-card>
          <q-card-section>
            <div class="row q-mb-md">
              <div class="col-12 col-sm-6">
                <q-input
                  filled
                  v-model="selected.name"
                  :label="$t('name')"
                  style="min-width: 200px"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-select
                  filled
                  clearable
                  v-model="selected.professionalTypeId"
                  :options="professionalTypeOptions"
                  :label="$t('type')"
                  class="on-right"
                  style="min-width: 200px"
                  emit-value
                  map-options
                />  
              </div>
            </div>
            <q-input
              filled
              v-model="selected.description"
              autogrow
              :label="$t('description')"
              class="q-mb-md"
              style="min-width: 200px"
            />
            <div class="row q-mb-md">
              <div class="col-12 col-sm-4">
                <q-input
                  filled
                  v-model="selected.tel"
                  :label="$t('phone')"
                  style="min-width: 200px"
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  filled
                  v-model="selected.email"
                  type="email"
                  :label="$t('email')"
                  class="on-right"
                  style="min-width: 200px"
                />  
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  filled
                  v-model="selected.web"
                  :label="$t('website')"
                  class="on-right"
                  style="min-width: 200px"
                />  
              </div>
            </div>
            <circle-map-input v-model="circle" height="600px" @update:model-value="onCircleInputUpdated"></circle-map-input>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat :label="$t('cancel')" v-close-popup />
            <q-btn
              color="primary"
              :label="$t('save')"
              v-close-popup
              @click="saveSelected"
              :disabled="disableSave()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { Query } from '@feathersjs/client';
import { Professional, ProfessionalType } from '@epfl-enac/arema';
import { makePaginationRequestHandler } from '../utils/pagination';
import type { PaginationOptions } from '../utils/pagination';
import CircleMapInput from '../components/CircleMapInput.vue';
import MapView from 'src/components/MapView.vue';
import { onMounted, ref, computed } from 'vue';
const { t } = useI18n({ useScope: 'global' });
const $q = useQuasar();
const { api } = useFeathers();
const service = api.service('professional');
const serviceType = api.service('professional-type');

const columns = [
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
    name: 'professionalTypeId',
    required: true,
    label: t('type'),
    align: 'left',
    field: 'professionalType',
    format: (val: ProfessionalType) => val ? t(val.text) : undefined,
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
    name: 'areaDelivery',
    required: true,
    label: t('areaDelivery'),
    align: 'left',
    field: 'areaDelivery',
    sortable: false,
  },
  {
    name: 'lastModification',
    required: true,
    label: t('last_modification'),
    align: 'left',
    field: (row: Professional) => {
      const date = new Date(row.updatedAt || row.createdAt);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    },
    sortable: false,
  },
  {
    name: 'action',
    align: 'left',
    label: t('action'),
  },
];

const professionalTypes = ref<ProfessionalType[]>([]);
const professionalTypeOptions = computed(() => {
  return professionalTypes.value
  .map((type) => {
    return {
      value: type.id + '',
      label: t(type.text),
    };
  })
  .sort((a, b) => {
    return a.label.localeCompare(b.label);
  })
})

const selected = ref<Professional>();
const circle = ref({});
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

onMounted(() => {
  serviceType.find({ query: { $limit: 50 } })
  .then((result) => {
    professionalTypes.value = result.data;
  });
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
        circleRadius: row.areaDelivery.radius,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            row.areaDelivery.coordinates,
            row.areaDelivery.coordinates,
            row.areaDelivery.coordinates,
            row.areaDelivery.coordinates,
          ]
        ]
      }
    };
  });
});

function disableSave() {
  return !selected.value.name || !selected.value.professionalTypeId || !selected.value.address || !selected.value.areaDelivery;
}

function fetchFromServer(
  startRow: number,
  count: number,
  filter: string,
  sortBy: string,
  descending: boolean
) {
  const query: Query = {
    $skip: startRow,
    $limit: count,
    $sort: {
      [sortBy]: descending ? -1 : 1,
    },
  };
  if (types.value) {
    query.professionalTypeId = {
      $in: types.value.map((type) => parseInt(type)),
    };
  }
  if (filter) {
    query.$or = [
      {
        name: {
          $like: `%${filter}%`,
        },
      },
      {
        address: {
          $like: `%${filter}%`,
        },
      },
    ];
  }
  return service.find({
    query,
  }).then((result) => {
    rows.value = result.data;
    loading.value = false;
    return result;    
  });
}

const onRequest = makePaginationRequestHandler(fetchFromServer, pagination);

function onTypeSelection() {
  tableRef.value.requestServerInteraction();
}

function onCircleInputUpdated(newValue) {
  if (newValue && newValue.properties && newValue.geometry) {
      selected.value.address = newValue.properties.display_name;
      selected.value.areaDelivery = {
        radius: newValue.properties.circleRadius,
        coordinates: newValue.geometry.coordinates[0][0],
      };
    } else {
      selected.value.address = null;
      selected.value.areaDelivery = null;
    }
}

function onAdd() {
  selected.value = {};
  circle.value = {};
  showEditDialog.value = true;
}

function onEdit(resource: Professional) {
  selected.value = { ...resource };
  const center = unref(selected.value.areaDelivery.coordinates);
  circle.value = {
    type: 'Feature',
    properties: {
      display_name: selected.value.address,
      circleRadius: selected.value.areaDelivery.radius,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          center,
          center,
          center,
          center,
        ]
      ]
    }
  };
  showEditDialog.value = true;
}

function saveSelected() {
  if (selected.value === undefined) return;
  if (selected.value.id) {
    delete selected.value.professionalType;
    // FIXME "find" returns a string whereas "create/patch" requires a number
    selected.value.professionalTypeId = parseInt(selected.value.professionalTypeId);
    service
      .patch(selected.value.id, selected.value)
      .then(() => {
        tableRef.value.requestServerInteraction();
      })
      .catch((err) => {
        $q.notify({
          message: err.message,
          type: 'negative',
        });
      });
  } else {
    selected.value.images = [];
    selected.value.links = [];
    selected.value.professionalTypeId = parseInt(selected.value.professionalTypeId);
    service
      .create(selected.value)
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
}

function remove(resource: Professional) {
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
