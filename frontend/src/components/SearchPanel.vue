<template>
  <div>
    <div class="text-h5 text-uppercase text-primary">
      {{ $t('search') }}
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
    <div class="row q-col-gutter-md">
      <div v-if="$q.screen.gt.sm" class="col-2">
        <div class="text-primary">{{ $t('filter_by_tags') }}</div>
        <tags-selector @update:ticked="onTreeSelection" />
      </div>
      <div class="col">
        <q-toolbar class="q-pl-none">
          <q-btn
            v-for="view in views"
            :key="view"
            :outline="view !== searchService.selectedView"
            color="secondary"
            unelevated
            square
            no-caps
            size="md"
            :icon="view === 'map' ? 'map' : 'view_list'"
            :title="$t(view)"
            class="on-left q-mb-md"
            @click="onViewSelect(view)"
          />
          <entity-types-selector v-model="selectedEntityTypes" use-geo @update:model-value="onEntityTypeSelect" />
          <q-btn-dropdown
            v-if="!$q.screen.gt.sm"
            :label="$t('filter_by_tags')"
            outline
            unelevated
            square
            no-caps
            size="md"
            color="secondary"
            class="on-left q-mb-md"
          >
            <template v-slot:label>
              <div>
                <q-badge
                  v-if="selectedTermsCount > 0"
                  class="q-ml-xs"
                  color="secondary"
                  :label="selectedTermsCount"
                  style="font-size: 12px"
                />
              </div>
            </template>
            <div class="q-pa-sm">
              <tags-selector @update:ticked="onTreeSelection" />
            </div>
          </q-btn-dropdown>
          <q-spinner-dots v-if="searchService.searching" size="md" class="q-mb-md" />
        </q-toolbar>
        <map-results v-if="searchService.selectedView === 'map'" />
        <list-results v-else-if="searchService.selectedView === 'list'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TagsSelector from 'src/components/TagsSelector.vue';
import EntityTypesSelector from './EntityTypesSelector.vue';
import MapResults from 'src/components/MapResults.vue';
import ListResults from 'src/components/ListResults.vue';

const taxonomies = useTaxonomyStore();
const searchService = useSearchService();

const views = ['map', 'list'];
const geoEntityTypes = ['building', 'professional'];

const selectedEntityTypes = ref<{ [key: string]: boolean }>({});
const selectedTermsCount = computed(() => {
  return searchService.selectedTerms.length;
});

onMounted(() => {
  taxonomies.init().then(() => {
    taxonomies.taxonomies?.taxonomy.forEach((tx) => {
      selectedEntityTypes.value[tx.id] = searchService.selectedEntityTypes.includes(tx.id);
    });
    searchService.bbox = [];
    searchService.search_entities(100);
  });
});

function onViewSelect(view: string) {
  if (view === 'map') {
    Object.keys(selectedEntityTypes.value)
      .filter((key) => !geoEntityTypes.includes(key))
      .forEach((key) => {
        selectedEntityTypes.value[key] = false;
      });
    onEntityTypeSelect();
  }
  searchService.selectedView = view;
}

function onTreeSelection() {
  searchService.search_filtered_entities();
}

function onEntityTypeSelect() {
  searchService.selectedEntityTypes = Object.keys(selectedEntityTypes.value).filter(
    (key) => selectedEntityTypes.value[key],
  );
  searchService.search_filtered_entities();
}
</script>
