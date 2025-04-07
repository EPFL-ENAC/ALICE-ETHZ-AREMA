<template>
  <div>
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
</template>

<script setup lang="ts">
const emit = defineEmits(['update:ticked']);

const taxonomyStore = useTaxonomyStore();
const searchService = useSearchService();

const nodes = computed(() => {
  return (
    taxonomyStore.taxonomies?.taxonomy.map((tx) => {
      const children = taxonomyStore.asOptions(tx.id, tx);
      return {
        value: tx.id,
        label: taxonomyStore.getLabel(tx.names),
        children: children.length > 1 ? children : children[0].children,
      };
    }) || []
  );
});

function onTreeSelection() {
  emit('update:ticked', searchService.selectedTerms);
}
</script>
