<template>
  <div v-if="!loading" class="row q-col-gutter-lg">
    <template v-for="row in rows" :key="`${row.entity_type}:${row.id}`">
      <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2">
        <q-card flat bordered class="q-ma-none">
          <q-card-section
            class="q-pa-md"
            style="cursor: pointer"
            @click="onEntity(row)"
          >
            <div class="text-primary">{{ $t(row.entity_type) }}</div>
            <div class="text-h5">{{ row.name }}</div>
            <div class="text-body2">{{ row.description }}</div>
            <div v-if="getImageUrls(row).length">
              <q-image :src="getImageUrls(row)[0]" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'ResultsGrid',
});
</script>
<script setup lang="ts">
import { cdnUrl } from 'src/boot/api';
import { Document } from 'src/models';

const searchService = useSearchService();

const loading = computed(() => searchService.searching);
const rows = computed(() => searchService.results?.data || []);

function getImageUrls(row: Document) {
  const images = row.files
    ? row.files
        .filter((fileRef) => fileRef.ref.mime_type?.startsWith('image'))
        .map((fileRef) => `${cdnUrl}/${fileRef.ref.path}`)
    : [];
  return images;
}

function onEntity(row: Document) {
  console.log('onEntity', row);
}
</script>
