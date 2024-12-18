<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row">
      <div class="col-12 col-md-3">
        <q-markdown v-if="document" :src="document.external_links" />
      </div>
      <div class="col-12 col-md-6">
        <div v-if="document">
          <div class="text-primary text-uppercase">
            {{ $t(document.entity_type) }}
          </div>
          <div class="text-h3">{{ document.name }}</div>
          <div>
            <tags-badges :document="document" />
          </div>
          <div class="text-body1">
            <q-markdown :src="document.description" />
          </div>
          <div class="text-body1">
            <q-markdown :src="document.article_top" />
          </div>
          <div v-if="document && getImageUrls().length">
            <template v-for="url in getImageUrls()" :key="url">
              <q-img :src="url" style="max-height: 100px; max-width: 100px" />
            </template>
          </div>
          <div class="text-body1">
            <q-markdown :src="document.article_bottom" />
          </div>
        </div>
      </div>
      <div class="col-12 col-md-3">
        <q-markdown v-if="document" :src="document.side_note" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { cdnUrl } from 'src/boot/api';
import { Document } from 'src/models';
import TagsBadges from 'src/components/TagsBadges.vue';

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

function getImageUrls() {
  if (!document.value) return [];
  const images = document.value.files
    ? document.value.files
        .filter((fileRef) => fileRef.ref.mime_type?.startsWith('image'))
        .map((fileRef) => `${cdnUrl}/${fileRef.ref.path}`)
    : [];
  console.log('getImageUrls', images);
  return images;
}
</script>
