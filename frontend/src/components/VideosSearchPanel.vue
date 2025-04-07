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
    <div class="row q-col-gutter-md">
      <div v-if="$q.screen.gt.sm" class="col-2">
        <div class="text-primary">{{ $t('filter_by_tags') }}</div>
        <tags-selector @update:ticked="onTreeSelection" />
      </div>
      <div class="col">
        <q-toolbar class="q-pl-none">
          <entity-types-selector v-model="selectedEntityTypes" @update:model-value="onEntityTypeSelect" />
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
        <videos-results />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EntityTypesSelector from 'src/components/EntityTypesSelector.vue';
import TagsSelector from 'src/components/TagsSelector.vue';
import VideosResults from 'src/components/VideosResults.vue';

const taxonomies = useTaxonomyStore();
const searchService = useSearchService();
const selectedTermsCount = computed(() => searchService.selectedTerms.length);
const selectedEntityTypes = ref<{ [key: string]: boolean }>({});

onMounted(() => {
  taxonomies.init().then(() => {
    taxonomies.taxonomies?.taxonomy.forEach((tx) => {
      selectedEntityTypes.value[tx.id] = searchService.selectedEntityTypes.includes(tx.id);
    });
    searchService.search_videos(100);
  });
});

function onTreeSelection() {
  searchService.search_videos();
}

function onEntityTypeSelect() {
  searchService.selectedEntityTypes = Object.keys(selectedEntityTypes.value).filter(
    (key) => selectedEntityTypes.value[key],
  );
  searchService.search_videos();
}
</script>
