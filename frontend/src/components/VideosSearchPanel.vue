<template>
  <div>
    <div class="text-h5 text-uppercase text-primary">
      {{ $t('videos') }}
    </div>
    <q-separator size="2px" class="bg-primary q-mt-md q-mb-md" />
    <q-input
      v-model="searchService.filterText"
      borderless
      clearable
      debounce="500"
      :input-style="`font-size: ${$q.screen.gt.sm ? 24 : 18}px;`"
      input-class="text-secondary"
      :placeholder="$t('type_here')"
      class="q-mt-sm q-mb-sm"
      @update:model-value="searchService.search_videos()"
    />
    <q-separator size="2px" class="bg-primary q-mt-md q-mb-md" />
    <terms-selector @update:terms="onTermsUpdate" view="list" />
    <q-separator size="2px" class="bg-primary q-mt-sm q-mb-md" />
    <q-spinner-dots v-if="searchService.searching" size="md" class="q-mb-md" />
    <videos-results />
  </div>
</template>

<script setup lang="ts">
import TermsSelector from 'src/components/TermsSelector.vue';
import VideosResults from 'src/components/VideosResults.vue';

const taxonomyStore = useTaxonomyStore();
const searchService = useSearchService();

onMounted(() => {
  if (!taxonomyStore.taxonomies) {
    taxonomyStore.init().then(() => {
      searchService.search_videos(100);
    });
  } else if (!searchService.videoResults?.total) {
    // do not search if was already done when coming back to this panel
    searchService.search_videos(100);
  }
});

function onTermsUpdate() {
  searchService.search_videos();
}
</script>
