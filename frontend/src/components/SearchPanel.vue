<template>
  <div>
    <div class="row">
      <div class="text-h5 text-uppercase text-primary">
        {{ t('search') }}
      </div>
      <q-space />
      <q-input
        v-model="searchService.filterText"
        dense
        square
        debounce="500"
        input-class="text-secondary"
        :placeholder="t('type_here')"
        @update:model-value="searchService.search_entities()"
        class="search-input"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <q-separator size="2px" class="bg-primary q-mt-md q-mb-md" />
    <terms-selector @update:terms="onTermsUpdate" :view="searchService.selectedView" />
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
        :title="t(view)"
        class="on-left"
        @click="onViewSelect(view)"
      />
      <q-spinner-dots v-if="searchService.searching" size="md" />
    </div>
    <list-results v-if="searchService.selectedView === 'list'" />
    <map-results v-if="searchService.selectedView === 'map'" />
  </div>
</template>

<script setup lang="ts">
import TermsSelector from 'src/components/TermsSelector.vue';
import MapResults from 'src/components/MapResults.vue';
import ListResults from 'src/components/ListResults.vue';

const { t } = useI18n();
const taxonomyStore = useTaxonomyStore();
const searchService = useSearchService();

const views = ['list', 'map'];
onMounted(() => {
  if (!taxonomyStore.taxonomies) {
    void taxonomyStore.init().then(() => {
      searchService.bbox = undefined;
      void searchService.search_entities(1000);
    });
  } else {
    // refresh search results if taxonomies are already loaded
    void searchService.search_entities(1000);
  }
});

function onViewSelect(view: string) {
  searchService.selectedView = view;
}

function onTermsUpdate() {
  void searchService.search_entities();
}
</script>

<style scoped>
.search-input ::v-deep(.q-field__control) {
  height: 32px;
}
</style>
