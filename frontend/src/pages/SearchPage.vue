<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal elevated class="bg-white text-grey-10">
      <q-bar dense class="bg-amber text-grey-8 q-pr-md">
        <q-space />
        <div v-for="lang in locales" :key="lang">
          <a
            href="#"
            :class="locale === lang ? 'text-weight-bold' : ''"
            :style="locale === lang ? 'text-decoration: none' : ''"
            class="text-grey-10"
            @click="onLocaleSelection(lang)"
            >{{ lang }}</a
          >
        </div>
      </q-bar>
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <q-btn
            flat
            label="Atlas of REgenerative MAterials"
            size="md"
            to="/"
            no-caps
          />

          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-black.svg" />
          </q-avatar>
        </q-toolbar-title>
        <q-space />
        <q-btn
          flat
          dense
          size="md"
          icon="search"
          :label="$t('search')"
          no-caps
          class="on-right"
          to="/search"
        />
        <q-btn
          flat
          dense
          size="md"
          :label="$t('contribute')"
          no-caps
          class="on-right"
          to="/contribute"
        />
        <q-btn
          flat
          dense
          size="md"
          :label="$t('charter')"
          no-caps
          class="on-right"
          to="/charta"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <div class="q-pt-lg">
        <q-expansion-item
          icon="manage_accounts"
          :label="$t('professionals')"
          default-opened
        >
          <div class="q-mt-sm q-pl-md q-pr-md q-pb-md">
            <q-tree
              :nodes="professionalTypes"
              node-key="id"
              label-key="text"
              no-connectors
              tick-strategy="leaf"
              v-model:ticked="professionalTypesTicked"
              v-model:expanded="professionalTypesExpanded"
              @update:ticked="onSelectProfessionalTypes"
            />
          </div>
        </q-expansion-item>

        <q-expansion-item
          icon="home_work"
          :label="$t('buildings')"
          default-opened
        >
          <div class="q-mt-sm q-pl-md q-pr-md q-pb-md">
            <q-tree
              :nodes="buildingTypes"
              node-key="id"
              label-key="text"
              no-connectors
              tick-strategy="leaf"
              v-model:ticked="buildingTypesTicked"
              v-model:expanded="buildingTypesExpanded"
              @update:ticked="onSelectBuildingTypes"
            />
          </div>
        </q-expansion-item>

        <q-expansion-item
          icon="landslide"
          :label="$t('natural_resources')"
          default-opened
        >
          <div class="q-mt-sm q-pl-md q-pr-md q-pb-md">
            <q-tree
              :nodes="lithologies"
              node-key="id"
              label-key="text"
              no-connectors
              tick-strategy="leaf"
              v-model:ticked="lithologyTicked"
              v-model:expanded="lithologyExpanded"
              @update:ticked="onSelectLithologies"
            />
            <q-tree
              :nodes="crops"
              node-key="id"
              label-key="text"
              no-connectors
              tick-strategy="leaf"
              v-model:ticked="cropTicked"
              v-model:expanded="cropExpanded"
              @update:ticked="onSelectCrops"
            />
          </div>
        </q-expansion-item>
      </div>
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <q-page>
        <div class="q-pa-lg">
          <div class="text-h2 text-weight-thin">{{ $t('search') }}</div>
          <div class="row q-mt-md">
            <div class="col-12 col-sm-6 col-md-6">
              <q-input
                dense
                debounce="300"
                v-model="filter"
                clearable
                style="width: 250px"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-sm-6 col-md-6">
              <q-btn-group
                flat
                :class="$q.screen.lt.sm ? 'q-mt-md' : 'float-right'"
              >
                <q-btn
                  flat
                  icon="grid_view"
                  :class="view === 'grid' ? 'bg-grey-4' : ''"
                  @click="view = 'grid'"
                />
                <q-btn
                  flat
                  icon="table_view"
                  :class="view === 'table' ? 'bg-grey-4' : ''"
                  @click="view = 'table'"
                />
                <q-btn
                  flat
                  icon="map"
                  :class="view === 'map' ? 'bg-grey-4' : ''"
                  @click="view = 'map'"
                />
              </q-btn-group>
            </div>
          </div>
        </div>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
          @update:model-value="onTabChange"
        >
          <q-tab name="professionals" :label="$t('professionals')" />
          <q-tab name="buildings" :label="$t('buildings')" />
          <q-tab name="natural-resources" :label="$t('natural_resources')" />
        </q-tabs>
        <div v-show="tab === 'professionals'">
          <div v-show="view !== 'map' && professionals" class="q-pa-sm">
            <q-table
              flat
              :grid="view === 'grid'"
              ref="professionalsTableRef"
              :rows="professionals"
              :columns="professionalsColumns"
              row-key="id"
              v-model:pagination="professionalsPagination"
              :loading="loading"
              :filter="filter"
              binary-state-sort
              @request="onProfessionalsRequest"
              :rows-per-page-options="[10, 25, 50]"
            >
              <template v-slot:body-cell-name="props">
                <q-td :props="props">
                  <a :href="`/professional/${props.row.id}`">{{
                    props.value
                  }}</a>
                </q-td>
              </template>
              <template v-slot:body-cell-description="props">
                <q-td :props="props" class="ellipsis" style="max-width: 200px">
                  {{ props.value }}
                </q-td>
              </template>
              <template v-slot:body-cell-professionalType="props">
                <q-td :props="props">
                  <q-chip color="info" text-color="white">{{
                    props.value
                  }}</q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-web="props">
                <q-td :props="props">
                  <a :href="props.value" target="_blank">{{ props.value }}</a>
                </q-td>
              </template>
              <template v-slot:body-cell-address="props">
                <q-td
                  :props="props"
                  style="max-width: 200px; white-space: inherit"
                >
                  {{ props.value }}
                </q-td>
              </template>
              <template v-slot:body-cell-radius="props">
                <q-td :props="props">
                  <q-chip>{{ props.value }} km</q-chip>
                </q-td>
              </template>
              <template v-slot:item="props">
                <div class="col-12 col-sm-4 col-md-3 col-lg-2">
                  <q-card flat bordered class="q-ma-md">
                    <q-card-section class="q-pa-none">
                      <q-img
                        :src="`/faker/${props.row.professionalType.text}.jpg`"
                        height="150px"
                      />
                    </q-card-section>
                    <q-card-section class="flex flex-center">
                      <div class="q-mb-sm text-center full-width">
                        <a :href="`/professional/${props.row.id}`">{{
                          props.row.name
                        }}</a>
                      </div>
                      <q-chip>{{ $t(props.row.professionalType.text) }}</q-chip>
                    </q-card-section>
                  </q-card>
                </div>
              </template>
            </q-table>
          </div>
          <div v-show="view === 'map'" class="full-height q-mt-md">
            <div>
              <map-view
                :features="professionalsFeatures"
                :center="[6.632273, 46.519962]"
                :zoom="6"
                :minZoom="10"
                :maxZoom="18"
                height="800px"
              />
            </div>
          </div>
        </div>

        <div v-show="tab === 'buildings'">
          <div v-show="view !== 'map' && buildings" class="q-pa-sm">
            <q-table
              flat
              :grid="view === 'grid'"
              ref="buildingsTableRef"
              :rows="buildings"
              :columns="buildingsColumns"
              row-key="id"
              v-model:pagination="buildingsPagination"
              :loading="loading"
              :filter="filter"
              binary-state-sort
              @request="onBuildingsRequest"
              :rows-per-page-options="[10, 25, 50]"
            >
              <template v-slot:body-cell-name="props">
                <q-td :props="props">
                  <a :href="`/building/${props.row.id}`">{{ props.value }}</a>
                </q-td>
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
                <q-td
                  :props="props"
                  style="max-width: 200px; white-space: inherit"
                >
                  {{ props.value }}
                </q-td>
              </template>
              <template v-slot:item="props">
                <div class="col-12 col-sm-4 col-md-3 col-lg-2">
                  <q-card flat bordered class="q-ma-md">
                    <q-card-section class="q-pa-none">
                      <q-img :src="`/faker/empty.jpg`" height="150px" />
                    </q-card-section>
                    <q-card-section class="flex flex-center">
                      <div class="q-mb-sm text-center full-width">
                        <a :href="`/building/${props.row.id}`">{{
                          props.row.name
                        }}</a>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </template>
            </q-table>
          </div>
          <div v-show="view === 'map'" class="full-height q-mt-md">
            <div>
              <map-view
                :features="buildingsFeatures"
                :center="[6.632273, 46.519962]"
                :zoom="6"
                :minZoom="10"
                :maxZoom="18"
                height="800px"
              />
            </div>
          </div>
        </div>

        <div v-show="tab === 'natural-resources'"></div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { makePaginationRequestHandler } from '../utils/pagination';
import type { PaginationOptions } from '../utils/pagination';
import MapView from '../components/MapView.vue';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';

const $q = useQuasar();
const route = useRoute();

const { api } = useFeathers();
const { t, locale } = useI18n({ useScope: 'global' });

const locales = ['en', 'de', 'fr'];

const tab = ref('professionals');
const view = ref('grid');
const professionalsTableRef = ref();
const professionals = ref<Professional[]>([]);
const buildingsTableRef = ref();
const buildings = ref<Building[]>([]);
const filter = ref('');
const loading = ref(false);
const professionalsPagination = ref<PaginationOptions>({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 25,
  rowsNumber: 25,
});
const buildingsPagination = ref<PaginationOptions>({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 25,
  rowsNumber: 25,
});

const leftDrawerOpen = ref(true);
const rightDrawerOpen = ref(false);

const professionalTypesTicked = ref<number[]>([]);
const buildingTypesTicked = ref<string[]>([]);
const lithologyTicked = ref<string[]>([]);
const cropTicked = ref<string[]>([]);
const professionalTypesExpanded = ref([0]);
const buildingTypesExpanded = ref([0]);
const lithologyExpanded = ref([0]);
const cropExpanded = ref([0]);
const professionalTypes = ref([
  {
    id: 0,
    text: t('type_of_professional'),
    icon: 'engineering',
    children: [],
  },
]);

const buildingTypes = [
  {
    id: 0,
    text: t('type_of_building'),
    icon: 'domain',
    children: [
      {
        id: 'renovation',
        text: t('building.renovation'),
      },
      {
        id: 'new',
        text: t('building.new'),
      },
    ],
  },
];

const lithologies = [
  {
    id: 0,
    text: t('lithology'),
    icon: 'legend_toggle',
    children: [
      {
        id: 'dolomite',
        text: t('litho.dolomite'),
      },
      {
        id: 'granite',
        text: t('litho.granite'),
      },
      {
        id: 'limestone',
        text: t('litho.limestone'),
      },
      {
        id: 'marble',
        text: t('litho.marble'),
      },
      {
        id: 'sandstone',
        text: t('litho.sandstone'),
      },
    ],
  },
];

const crops = [
  {
    id: 0,
    text: t('crops'),
    icon: 'agriculture',
    children: [
      {
        id: 'buckwheat',
        text: t('crop.buckwheat'),
      },
      {
        id: 'hemp',
        text: t('crop.hemp'),
      },
      {
        id: 'wheat',
        text: t('crop.wheat'),
      },
    ],
  },
];

const professionalsColumns = [
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
    name: 'professionalType',
    required: true,
    label: t('type'),
    align: 'left',
    field: 'professionalType',
    format: (val: ProfessionalType) => (val ? t(val.text) : undefined),
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
];

const buildingsColumns = [
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
    sortable: true,
  },
];

const professionalsFeatures = computed(() => {
  return professionals.value.map((row) => {
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
        coordinates: [
          [
            row.coordinates.point,
            row.coordinates.point,
            row.coordinates.point,
            row.coordinates.point,
          ],
        ],
      },
    };
  });
});

const buildingsFeatures = computed(() => {
  return buildings.value.map((row) => {
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
        coordinates: row.coordinates.point,
      },
    };
  });
});

onMounted(() => {
  console.log(route.query);
  if (route.query.tab) {
    tab.value = route.query.tab as string;
  }
  api
    .service('professional-type')
    .find({
      query: {
        $limit: 10,
      },
    })
    .then((res) => {
      professionalTypes.value[0].children = res.data
        .map((pt: ProfessionalType) => {
          return {
            id: pt.id,
            text: t(pt.text),
          };
        })
        .sort((a: ProfessionalType, b: ProfessionalType) => {
          return a.text.localeCompare(b.text);
        });
      professionalTypesTicked.value = professionalTypes.value[0].children.map(
        (pt) => pt.id,
      );
      if (tab.value === 'professionals') {
        if (route.query.type) {
          professionalTypesTicked.value = [
            parseInt(route.query.type as string),
          ];
        }
        professionalsTableRef.value.requestServerInteraction();
      } else if (tab.value === 'buildings') {
        buildingsTableRef.value.requestServerInteraction();
      }
    });
  buildingTypesTicked.value = buildingTypes[0].children.map((bt) => bt.id);
  lithologyTicked.value = lithologies[0].children.map((l) => l.id);
  cropTicked.value = crops[0].children.map((c) => c.id);
});

function onLocaleSelection(lang: string) {
  locale.value = lang;
  window.location.reload();
}

function fetchProfessionalsFromServer(
  startRow: number,
  count: number,
  filter: string,
  sortBy: string,
  descending: boolean,
) {
  const query: Query = {
    $skip: startRow,
    $limit: count,
    $sort: {
      [sortBy]: descending ? -1 : 1,
    },
  };
  console.log('professionalTypesTicked', professionalTypesTicked.value);
  if (
    professionalTypesTicked.value &&
    professionalTypesTicked.value.length > 0
  ) {
    query.professionalTypeId = {
      $in: professionalTypesTicked.value,
    };
  }
  if (filter) {
    query.$or = [
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
  console.log('query', query);
  return api
    .service('professional')
    .find({
      query,
    })
    .then((result) => {
      professionals.value = result.data;
      loading.value = false;
      return result;
    });
}

const onProfessionalsRequest = makePaginationRequestHandler(
  fetchProfessionalsFromServer,
  professionalsPagination,
);

function fetchBuildingsFromServer(
  startRow: number,
  count: number,
  filter: string,
  sortBy: string,
  descending: boolean,
) {
  const query: Query = {
    $skip: startRow,
    $limit: count,
    $sort: {
      [sortBy]: descending ? -1 : 1,
    },
  };
  if (filter) {
    query.$or = [
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
  console.log('query', query);
  return api
    .service('building')
    .find({
      query,
    })
    .then((result) => {
      buildings.value = result.data;
      loading.value = false;
      return result;
    });
}

const onBuildingsRequest = makePaginationRequestHandler(
  fetchBuildingsFromServer,
  buildingsPagination,
);

function onTabChange() {
  console.log('tab changed', tab.value);
  if (tab.value === 'professionals') {
    professionalsTableRef.value.requestServerInteraction();
  } else if (tab.value === 'buildings') {
    buildingsTableRef.value.requestServerInteraction();
  }
}

function onSelectProfessionalTypes() {
  console.log('selected', professionalTypesTicked.value);
  if (
    professionalTypesTicked.value &&
    professionalTypesTicked.value.length > 0
  ) {
    professionalsTableRef.value.requestServerInteraction();
  } else {
    professionals.value = [];
  }
}

function onSelectBuildingTypes() {
  console.log('selected', buildingTypesTicked.value);
}

function onSelectLithologies() {
  console.log('selected', lithologyTicked.value);
}

function onSelectCrops() {
  console.log('selected', cropTicked.value);
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

// function toggleRightDrawer() {
//   rightDrawerOpen.value = !rightDrawerOpen.value;
// }
</script>
