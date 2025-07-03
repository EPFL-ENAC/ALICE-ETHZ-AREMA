<template>
  <div>
    <div>
      <div v-if="!loading" class="masonry">
        <template v-for="row in rows" :key="`${row.entity_type}:${row.id}`">
          <q-card flat bordered class="card">
            <q-card-section
              class="q-pa-md"
              style="cursor: pointer; height: 100%"
              @click="onDocument(row)"
            >
              <div class="text-primary text-uppercase">{{ t(row.entity_type) }}</div>
              <div class="text-h5">{{ row.name }}</div>
              <div>
                <tags-badges :item="row" />
              </div>
              <q-markdown :src="row.description" class="fade-text" no-heading-anchor-links />
              <div v-if="getImageUrls(row).length" class="q-mt-md">
                <q-img
                  :src="getImageUrls(row)[0]"
                  height="100px"
                  style="max-width: 100%"
                  fit="cover"
                />
              </div>
            </q-card-section>
          </q-card>
        </template>
        <div v-if="rows.length === 0">
          {{ t('no_results') }}
        </div>
      </div>
    </div>
    <div v-if="count < total" class="q-mt-md">
      <q-btn
        color="primary"
        unelevated
        square
        no-caps
        size="md"
        :label="t('show_more')"
        @click="loadMore"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Document } from 'src/models';
import TagsBadges from 'src/components/TagsBadges.vue';
import { getImageUrls } from 'src/utils/files';

const { t } = useI18n();
const searchService = useSearchService();
const router = useRouter();

const total = computed(() => searchService.results?.total || 0);
const count = computed(() => searchService.results?.data?.length || 0);
const loading = computed(() => searchService.searching);
const rows = computed(() => searchService.results?.data || []);

function onDocument(row: Document) {
  void router.push({ name: 'doc', params: { id: `${row.entity_type}:${row.id}` } });
}

function loadMore() {
  void searchService.search_entities(searchService.limit + 100);
}
</script>

<style scoped>
.masonry {
  column-count: 6;
  column-gap: 1rem;
}

.card {
  break-inside: avoid;
  margin-bottom: 1rem;
}
@media (max-width: 1024px) {
  .masonry {
    column-count: 4;
  }
}
@media (max-width: 768px) {
  .masonry {
    column-count: 2;
  }
}
@media (max-width: 480px) {
  .masonry {
    column-count: 1;
  }
}
</style>
