<template>
  <div>
    <q-chip
      v-for="tag in labels"
      :key="tag"
      outline
      color="primary"
      size="12px"
      class="q-ml-none q-mr-sm no-border-radius"
    >
      {{ tag }}
    </q-chip>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'TagsBadges',
});
</script>
<script setup lang="ts">
import { Document } from 'src/models';
const taxonomies = useTaxonomyStore();

interface Props {
  document: Document;
}

const props = defineProps<Props>();

const labels = ref<string[]>([]);

onMounted(init);

watch(() => props.document, init);

function init() {
  taxonomies.init().then(() => {
    labels.value = getTagLabels(props.document);
  });
}

function getTagLabels(row: Document) {
  return row.tags
    ? row.tags
        .map((tag) => taxonomies.getNode(tag))
        .filter((node) => node)
        .map((node) => taxonomies.getLabel(node?.names))
        .filter((label) => label !== undefined)
    : [];
}
</script>
