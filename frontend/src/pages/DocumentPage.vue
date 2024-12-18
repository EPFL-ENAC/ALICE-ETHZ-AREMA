<template>
  <q-page class="q-pa-md bg-grey-2">
    <div v-if="searchService.searching">
      <q-spinner-dots />
    </div>
    <div v-else>
      <document-panel v-if="document" :document="document" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import DocumentPanel from 'src/components/DocumentPanel.vue';
import { Document } from 'src/models';

const route = useRoute();
const searchService = useSearchService();

const document = ref<Document>();

const document_id = computed(() => route.params.id as string);

onMounted(updateDocument);

watch(() => route.params.id, updateDocument);

async function updateDocument() {
  if (route.params.id) {
    document.value = await searchService.getDocument(document_id.value);
  }
}
</script>
