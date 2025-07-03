<template>
  <div>
    <div class="text-h5 text-uppercase text-primary">
      {{ t('videos') }}
    </div>
    <q-separator size="2px" class="bg-primary q-mt-md q-mb-md" />
    <terms-selector @update:terms="onTermsUpdate" view="list" />
    <q-spinner-dots v-if="searchService.searching" size="md" class="q-mb-md" />
    <videos-results />
  </div>
</template>

<script setup lang="ts">
import TermsSelector from 'src/components/TermsSelector.vue';
import VideosResults from 'src/components/VideosResults.vue';

const { t } = useI18n();
const taxonomyStore = useTaxonomyStore();
const searchService = useSearchService();

onMounted(() => {
  if (!taxonomyStore.taxonomies) {
    void taxonomyStore.init().then(() => {
      void searchService.search_videos(100);
    });
  } else if (!searchService.videoResults?.total) {
    // do not search if was already done when coming back to this panel
    void searchService.search_videos(100);
  }
});

function onTermsUpdate() {
  void searchService.search_videos();
}
</script>
