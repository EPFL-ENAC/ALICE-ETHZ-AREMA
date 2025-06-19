<template>
  <div>
    <div class="text-h5 text-uppercase text-primary">
      {{ $t('filters') }}
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
      @update:model-value="searchService.search_filtered_entities()"
    />
    <q-separator size="2px" class="bg-primary q-mt-md q-mb-md" />
    <terms-selector @update:terms="onTermsUpdate" :view="searchService.selectedView" />
    <q-separator size="2px" class="bg-primary q-mt-sm q-mb-md" />
    <div class="q-mt-md q-mb-md">
      <q-btn
        v-for="view in views"
        :key="view"
        :outline="view !== searchService.selectedView"
        :icon="view === 'map' ? 'map' : 'view_list'"
        color="secondary"
        unelevated
        square
        no-caps
        size="md"
        :title="$t(view)"
        class="on-left"
        @click="onViewSelect(view)"
      />
      <q-spinner-dots v-if="searchService.searching" size="md" />
    </div>
    <map-results v-if="searchService.selectedView === 'map'" />
    <list-results v-else-if="searchService.selectedView === 'list'" />
  </div>
</template>

<script setup lang="ts">
import TermsSelector from 'src/components/TermsSelector.vue';
import MapResults from 'src/components/MapResults.vue';
import ListResults from 'src/components/ListResults.vue';

const taxonomyStore = useTaxonomyStore();
const searchService = useSearchService();

const views = ['map', 'list'];
onMounted(() => {
  if (!taxonomyStore.taxonomies) {
    taxonomyStore.init().then(() => {
      searchService.bbox = [];
      searchService.search_entities(1000);
    });
  } else if (!searchService.results?.total) {
    // do not search if was already done when coming back to this panel
    searchService.bbox = [];
    searchService.search_entities(1000);
  }
});

function onViewSelect(view: string) {
  searchService.selectedView = view;
}

function onTermsUpdate() {
  searchService.search_filtered_entities();
}
</script>
