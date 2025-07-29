<template>
  <q-page>
    <div class="text-h5 q-pa-md">{{ t('dashboard') }}</div>
    <q-separator />
    <div class="q-pa-md">
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

const authStore = useAuthStore();
const searchService = useSearchService();
const $q = useQuasar();
const { t } = useI18n({ useScope: 'global' });

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
