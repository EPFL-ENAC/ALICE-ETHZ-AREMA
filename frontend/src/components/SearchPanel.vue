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
      :input-style="`font-size: ${$q.screen.gt.sm ? 36 : 24}px;`"
      input-class="text-secondary"
      :placeholder="$t('type_here')"
      class="q-mt-md q-mb-md"
      @update:model-value="searchService.search_filtered_entities()"
    />
    <q-separator size="2px" class="bg-primary q-mt-md q-mb-md" />
    <div class="row q-col-gutter-md">
      <div class="col-2">
        <q-tree
          :nodes="nodes"
          node-key="value"
          label-key="label"
          v-model:ticked="searchService.selectedTerms"
          tick-strategy="leaf"
          class="text-primary"
          @update:ticked="onTreeSelection"
        />
      </div>
      <div class="col">
        <div class="q-mb-md">
          <q-btn
            v-for="view in views"
            :key="view"
            :outline="view !== searchService.selectedView"
            color="secondary"
            unelevated
            square
            no-caps
            size="md"
            :label="$t(view)"
            class="on-left"
            @click="onViewSelect(view)"
          />
          <span>{{ $t('filter_by') }}</span>
          <template v-for="entityType in entityTypes" :key="entityType.value">
            <q-toggle
              v-model="selectedEntityTypes[entityType.value]"
              :label="entityType.label"
              size="sm"
              class="text-primary on-left"
              @update:model-value="onEntityTypeSelect()"
            />
          </template>
          <q-spinner-dots v-if="searchService.searching" size="md" />
        </div>
        <map-results v-if="searchService.selectedView === 'map'" />
        <list-results v-else-if="searchService.selectedView === 'list'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MapResults from 'src/components/MapResults.vue';
import ListResults from 'src/components/ListResults.vue';

const taxonomies = useTaxonomyStore();
const searchService = useSearchService();

const views = ['map', 'list'];

const nodes = computed(() => {
  return (
    taxonomies.taxonomies?.taxonomy.map((tx) => {
      return {
        value: tx.id,
        label: taxonomies.getLabel(tx.names),
        children: taxonomies.asOptions(tx.id, tx),
      };
    }) || []
  );
});
const entityTypes = computed(() => {
  return (
    taxonomies.taxonomies?.taxonomy.map((tx) => {
      return {
        value: tx.id,
        label: taxonomies.getLabel(tx.names),
      };
    }) || []
  );
});

const selectedEntityTypes = ref<{ [key: string]: boolean }>({});

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
