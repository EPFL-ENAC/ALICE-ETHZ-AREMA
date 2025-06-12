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
    <terms-selector @update:terms="onTermsUpdate" />
    <q-separator size="2px" class="bg-primary q-mt-sm q-mb-md" />
    <q-spinner-dots v-if="searchService.searching" size="md" class="q-mb-md" />
    <videos-results />
  </div>
</template>

<script setup lang="ts">
import TermsSelector from 'src/components/TermsSelector.vue';
import VideosResults from 'src/components/VideosResults.vue';

const taxonomies = useTaxonomyStore();
const searchService = useSearchService();
const selectedEntityTypes = ref<{ [key: string]: boolean }>({});

onMounted(() => {
  taxonomies.init().then(() => {
    taxonomies.taxonomies?.taxonomy.forEach((tx) => {
      selectedEntityTypes.value[tx.id] = searchService.selectedEntityTypes.includes(tx.id);
    });
    searchService.search_videos(100);
  });
});

function onTermsUpdate() {
  searchService.search_videos();
}
</script>
