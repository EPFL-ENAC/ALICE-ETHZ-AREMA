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
      input-style="font-size: 48px;"
      input-class="text-secondary"
      :placeholder="$t('type_here')"
      class="q-mt-md q-mb-md"
      @update:model-value="searchService.search_videos()"
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
        >
          <template v-slot:header-entity="prop">
            <div class="row items-center">
              <div class="text-primary">{{ prop.node.label }}</div>
              <q-toggle
                v-model="selectedEntityTypes[prop.node.value]"
                size="sm"
                class="on-left"
                @update:model-value="onEntityTypeSelect()"
              />
            </div>
          </template>
        </q-tree>
      </div>
      <div class="col">
        <videos-results />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VideosResults from 'src/components/VideosResults.vue';

const taxonomies = useTaxonomyStore();
const searchService = useSearchService();

const nodes = computed(() => {
  return (
    taxonomies.taxonomies?.taxonomy.map((tx) => {
      return {
        value: tx.id,
        label: taxonomies.getLabel(tx.names),
        children: taxonomies.asOptions(tx.id, tx),
        header: 'entity',
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
