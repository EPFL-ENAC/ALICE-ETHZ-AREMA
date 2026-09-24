<template>
  <div>
    <q-chip
      v-for="tag in tags"
      :key="tag.urn"
      outline
      color="primary"
      size="12px"
      class="q-ml-none q-mr-sm no-border-radius"
      :clickable="clickable"
      @click="onTag(tag.urn)"
    >
      {{ tag.label }}
    </q-chip>
  </div>
</template>

<script setup lang="ts">
import type { Document, Video } from '@/models';
const taxonomies = useTaxonomyStore();
const searchService = useSearchService();
const router = useRouter();

interface Props {
  item: Document | Video;
  clickable?: boolean;
}

const props = defineProps<Props>();

const tags = ref<{ urn: string; label: string }[]>([]);

onMounted(init);

watch(() => props.item, init);

function init() {
  void taxonomies.init().then(() => {
    tags.value = getTags(props.item);
  });
}

function getTags(item: Document | Video) {
  return (item.tags || []).flatMap((urn) => {
    const label = taxonomies.getLabel(taxonomies.getNode(urn)?.names);
    return label ? [{ urn, label }] : [];
  });
}

// start a new search filtered by the clicked tag
function onTag(urn: string) {
  if (!props.clickable) return;
  searchService.filterText = '';
  searchService.bbox = undefined;
  const isResource = urn.startsWith('urn:arema:natural-resource:');
  searchService.selectedTerms = isResource ? [] : [urn];
  searchService.selectedResourceTerms = isResource ? [urn] : [];
  void router.push('/search');
}
</script>
