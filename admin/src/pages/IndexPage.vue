<template>
  <q-page>
    <div class="text-h5 q-pa-md">{{ t('dashboard') }}</div>
    <q-separator />
    <div class="q-pa-md">
      <div v-show="authStore.isAuthenticated">
        <div class="text-h6 q-mb-md">{{ t('contributions') }}</div>
        <q-spinner-dots v-if="statsStore.loading" size="lg" color="primary" />
        <div v-if="!statsStore.loading" class="row">
          <div v-for="type in types" :key="type">
            <FieldFrequenciesChart :type="type" :height="200" :width="300" />
          </div>
        </div>
        <div v-if="!statsStore.loading" class="row q-col-gutter-md q-mb-md">
          <q-select
            v-show="false"
            v-model="groupBy"
            :options="[
              { label: t('state'), value: 'state' },
              { label: t('created_by'), value: 'created_by' },
              { label: t('updated_by'), value: 'updated_by' },
              { label: t('published_by'), value: 'published_by' },
            ]"
            emit-value
            map-options
            filled
            dense
            :label="t('group_by')"
            @update:model-value="onLoadFrequencies"
            style="width: 200px"
          />
          <q-checkbox
            v-model="createdByMe"
            :label="t('created_by_me')"
            @update:model-value="onLoadFrequencies"
          />
        </div>
      </div>
      <div v-if="authStore.isAdmin">
        <div class="text-h6 q-mb-md q-mt-lg">{{ t('search_index') }}</div>
        <div class="text-help q-mb-md">{{ t('search_index_help') }}</div>
        <div class="q-mb-md">
          <q-btn
            size="sm"
            color="primary"
            :disable="searchService.indexing"
            :label="t('drop_index')"
            icon="delete_sweep"
            @click="onDropIndex"
          />
          <q-btn
            size="sm"
            color="primary"
            :disable="searchService.indexing"
            :label="t('index_all')"
            icon="manage_search"
            @click="onIndexAll"
            class="on-right"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import FieldFrequenciesChart from 'src/components/charts/FieldFrequenciesChart.vue';
import { notifyError } from 'src/utils/notify';

const authStore = useAuthStore();
const searchService = useSearchService();
const statsStore = useStatsStore();
const $q = useQuasar();
const { t } = useI18n();

const groupBy = ref('state');
const createdByMe = ref(false);
const username = computed(() => authStore.profile?.username || authStore.profile?.email);

const types = computed(() => {
  return [
    'natural-resource',
    'building-material',
    'technical-construction',
    'building',
    'professional',
  ].filter((type) => statsStore.frequencies?.[type]);
});

onMounted(() => {
  if (authStore.isAuthenticated) {
    createdByMe.value = authStore.isContributor;
    onLoadFrequencies();
  }
});

watch(
  () => authStore.isAuthenticated,
  () => {
    if (authStore.isAuthenticated) {
      createdByMe.value = authStore.isContributor;
      onLoadFrequencies();
    }
  },
);

function onLoadFrequencies() {
  const filter: Record<string, string> | undefined = createdByMe.value
    ? { created_by: username.value || '' }
    : undefined;
  statsStore.loadFrequencies(groupBy.value, filter).catch((err) => {
    console.error('Error loading frequencies:', err);
    notifyError(err);
  });
}

function onIndexAll() {
  searchService
    .indexAll()
    .then((result) => {
      const counts = Object.entries(result).map(([key, value]) => `${t(key)}: ${value as number}`);
      $q.notify({
        message: t('all_items_indexed', { count: counts.join(', ') }),
        type: 'positive',
      });
    })
    .catch((err) => {
      console.error(err);
      $q.notify({
        message: t('indexing_error'),
        type: 'negative',
      });
    });
}

function onDropIndex() {
  searchService
    .dropIndex()
    .then(() => {
      $q.notify({
        message: t('index_dropped'),
        type: 'positive',
      });
    })
    .catch((err) => {
      console.error(err);
      $q.notify({
        message: t('index_drop_error'),
        type: 'negative',
      });
    });
}
</script>
