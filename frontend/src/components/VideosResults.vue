<template>
  <div>
    <div>
      <div class="q-mb-md">{{ t('results', { count: total }) }}</div>
      <div v-if="!loading" class="masonry">
        <template v-for="row in rows" :key="`${row.entity_type}:${row.id}`">
          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2">
            <q-card flat bordered class="card">
              <q-card-section
                class="q-pa-md"
                style="cursor: pointer; height: 100%"
                @click="onDocument(row)"
              >
                <div class="text-primary">{{ t(row.entity_type) }}</div>
                <div class="text-h5">{{ row.name }}</div>
                <div>
                  <tags-badges :item="row" />
                </div>
                <div class="text-body2">
                  <q-markdown :src="row.legend" no-heading-anchor-links />
                </div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                <q-video :src="toEmbededVideoUrl(row.url)" />
                <q-btn
                  color="accent"
                  flat
                  no-caps
                  size="sm"
                  :label="t('watch')"
                  icon-right="open_in_new"
                  class="full-width"
                  @click="onVideo(row)"
                />
              </q-card-section>
            </q-card>
          </div>
        </template>
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
import type { Video } from 'src/models';
import TagsBadges from 'src/components/TagsBadges.vue';
import { toEmbededVideoUrl } from 'src/utils/files';

const { t } = useI18n();
const searchService = useSearchService();
const router = useRouter();

const total = computed(() => searchService.videoResults?.total || 0);
const count = computed(() => searchService.videoResults?.data?.length || 0);

const loading = computed(() => searchService.searching);
const rows = computed(() => searchService.videoResults?.data || []);

function onVideo(row: Video) {
  window.open(row.url, '_blank');
}

function onDocument(row: Video) {
  void router.push({ name: 'doc', params: { id: row.parent_id } });
}

function loadMore() {
  void searchService.search_videos(searchService.limit + 100);
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
