<template>
  <q-page>
    <div class="text-h5 q-pa-md">{{ $t('dashboard') }}</div>
    <q-separator />
    <div class="q-pa-md">
      <div class="text-h6 q-mb-md">{{ $t('layout') }}</div>
      <div class="text-help q-mb-md">{{ $t('layout_help') }}</div>
      <div class="row">
        <div class="col-12 col-md-2"></div>
        <div class="col-12 col-md-8">
          <q-card flat bordered class="text-grey-8">
            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-2">
                  <q-skeleton
                    height="100px"
                    class="q-pa-md bg-teal-1"
                    style="margin-top: 650px"
                  >
                    {{ $t('external_links') }}
                  </q-skeleton>
                </div>
                <div class="col-8">
                  <q-skeleton height="50px" class="q-mb-md q-pa-md bg-teal-1">
                    {{ $t('name') }}
                  </q-skeleton>
                  <q-skeleton height="100px" class="q-mb-md q-pa-md bg-teal-1">
                    {{ $t('description') }}
                  </q-skeleton>

                  <q-skeleton height="100px" class="q-mb-md q-pa-md bg-teal-1">
                    {{ $t('physical_characteristics') }}
                  </q-skeleton>

                  <q-skeleton height="150px" class="q-mb-md q-pa-md bg-teal-1">
                    {{ $t('article_top') }}
                  </q-skeleton>

                  <div
                    style="
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      flex-direction: column;
                    "
                  >
                    <q-skeleton
                      width="300px"
                      height="100px"
                      class="q-mb-md q-pa-md bg-teal-1"
                    >
                      {{ $t('multimedia') }}
                    </q-skeleton>

                    <q-skeleton
                      type="rect"
                      width="300px"
                      class="q-mb-md q-pa-xs bg-teal-1"
                    >
                      {{ $t('legend') }}
                    </q-skeleton>
                  </div>

                  <q-skeleton height="150px" class="q-pa-md bg-teal-1">
                    {{ $t('article_bottom') }}
                  </q-skeleton>
                </div>
                <div class="col-2">
                  <q-skeleton
                    height="100px"
                    class="q-pa-md bg-teal-1"
                    style="margin-top: 300px"
                  >
                    {{ $t('side_note') }}
                  </q-skeleton>
                </div>
              </div>
            </q-card-section>
            <div></div>
          </q-card>
        </div>
        <div class="col-12 col-md-2"></div>
      </div>
      <div class="text-h6 q-mb-md q-mt-lg">{{ $t('search_index') }}</div>
      <div class="text-help q-mb-md">{{ $t('search_index_help') }}</div>
      <div class="q-mb-md">
        <q-btn
          v-if="authStore.isAdmin"
          size="sm"
          color="primary"
          :disable="searchService.indexing"
          :label="$t('drop_index')"
          icon="delete_sweep"
          @click="onDropIndex"
        />
        <q-btn
          v-if="authStore.isAdmin"
          size="sm"
          color="primary"
          :disable="searchService.indexing"
          :label="$t('index_all')"
          icon="manage_search"
          @click="onIndexAll"
          class="on-right"
        />
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
      const counts = Object.entries(result).map(
        ([key, value]) => `${t(key)}: ${value}`,
      );
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
