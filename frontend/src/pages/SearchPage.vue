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
        <div class="text-h6 q-pl-sm">{{ $t('professionals') }}</div>
        <q-tree
          :nodes="professionalTypes"
          node-key="id"
          label-key="text"
          no-connectors
          tick-strategy="leaf"
          v-model:ticked="ticked"
          v-model:expanded="expanded"
          @update:ticked="onSelect"
        />
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
            <div class="col-12 col-md-6">
              <q-input dense debounce="300" v-model="filter" clearable>
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-btn-group flat class="float-right">
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
        <div v-if="view !== 'map'" class="q-pa-sm">
          <q-table
            flat
            :grid="view === 'grid'"
            ref="tableRef"
            :rows="professionals"
            :columns="columns"
            row-key="id"
            v-model:pagination="pagination"
            :loading="loading"
            :filter="filter"
            binary-state-sort
            @request="onRequest"
            :rows-per-page-options="[10, 25, 50]"
          >
            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                <a :href="`/professional/${props.row.id}`">{{ props.value }}</a>
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
            <template v-slot:body-cell-areaDelivery="props">
              <q-td :props="props">
                <q-chip>{{ props.value.radius }} km</q-chip>
              </q-td>
            </template>
            <template v-slot:item="props">
              <div class="col-12 col-sm-6 col-md-2">
                <q-card flat bordered class="q-ma-md">
                  <q-card-section class="q-pa-none">
                    <q-img
                      :src="`/faker/${props.row.professionalType.text}.jpg`"
                      height="150px"
                    />
                  </q-card-section>
                  <q-card-section class="flex flex-center">
                    <div class="q-mb-sm">
                      <a :href="`/professional/${props.row.id}`">{{
                        props.row.name
                      }}</a>
                    </div>
                    <div>
                      <q-chip>{{ $t(props.row.professionalType.text) }}</q-chip>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </template>
          </q-table>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { Query } from '@feathersjs/client';
import { Professional, ProfessionalType } from '@epfl-enac/arema';
import { makePaginationRequestHandler } from '../utils/pagination';
import type { PaginationOptions } from '../utils/pagination';
import { useCookies } from 'vue3-cookies';

const { cookies } = useCookies();
const { api } = useFeathers();
const { t, locale } = useI18n({ useScope: 'global' });

const locales = ['en', 'de', 'fr'];

const view = ref('grid');
const tableRef = ref();
const professionals = ref<Professional[]>([]);
const filter = ref('');
const loading = ref(false);
const pagination = ref<PaginationOptions>({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 25,
  rowsNumber: 25,
});

const leftDrawerOpen = ref(true);
const rightDrawerOpen = ref(false);

const ticked = ref([]);
const expanded = ref([0]);
const professionalTypes = ref([
  {
    id: 0,
    text: 'Type of professional',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    children: [],
  },
]);

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
    name: 'areaDelivery',
    required: true,
    label: t('areaDelivery'),
    align: 'left',
    field: 'areaDelivery',
    sortable: false,
  },
];

onMounted(() => {
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
      ticked.value = res.data.map((pt: ProfessionalType) => pt.id);
      tableRef.value.requestServerInteraction();
    });
});

function onLocaleSelection(lang: string) {
  locale.value = lang;
  cookies.set('locale', lang);
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
  if (ticked.value && ticked.value.length > 0) {
    query.professionalTypeId = {
      $in: ticked.value,
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

const onRequest = makePaginationRequestHandler(fetchFromServer, pagination);

function onSelect() {
  console.log('selected', ticked.value);
  tableRef.value.requestServerInteraction();
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}
</script>
