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

<script setup lang="ts">
import { Document, Video } from 'src/models';
const taxonomies = useTaxonomyStore();

interface Props {
  item: Document | Video;
}

const props = defineProps<Props>();

const labels = ref<string[]>([]);

onMounted(init);

watch(() => props.item, init);

function init() {
  taxonomies.init().then(() => {
    labels.value = getTagLabels(props.item);
  });
}

function getTagLabels(item: Document | Video) {
  return item.tags
    ? item.tags
        .map((tag) => taxonomies.getNode(tag))
        .filter((node) => node)
        .map((node) => taxonomies.getLabel(node?.names))
        .filter((label) => label !== undefined)
    : [];
}
</script>
