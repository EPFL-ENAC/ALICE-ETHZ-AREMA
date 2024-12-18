<template>
  <div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-3"></div>
      <div class="col-12 col-md-6">
        <div class="text-primary text-uppercase q-mb-sm">
          {{ $t(document.entity_type) }}
        </div>
        <div class="text-h2 q-mb-md">{{ document.name }}</div>
        <div class="q-mb-lg">
          <tags-badges :document="document" />
        </div>
        <div class="text-h5 q-mb-lg">
          <q-markdown :src="document.description" />
        </div>
      </div>
      <div class="col-12 col-md-3"></div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-1"></div>
      <div class="col-12 col-md-2">
        <div v-if="document?.external_links">
          <div class="text-primary">
            {{ $t('external_links') }}
          </div>
          <q-separator color="primary" class="q-mb-sm" />
          <q-markdown :src="document.external_links" />
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div>
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
      <div class="col-12 col-md-2">
        <q-markdown
          v-if="document.side_note"
          :src="document.side_note"
          class="text-primary"
        />
      </div>
      <div class="col-12 col-md-1"></div>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'DocumentPanel',
});
</script>
<script setup lang="ts">
import { cdnUrl } from 'src/boot/api';
import { Document } from 'src/models';
import TagsBadges from 'src/components/TagsBadges.vue';

interface Props {
  document: Document;
}

const props = defineProps<Props>();

function getImageUrls() {
  if (!props.document) return [];
  const images = props.document.files
    ? props.document.files
        .filter((fileRef) => fileRef.ref.mime_type?.startsWith('image'))
        .map((fileRef) => `${cdnUrl}/${fileRef.ref.path}`)
    : [];
  return images;
}
</script>
