<template>
  <div>
    <div v-if="!loading" class="row q-col-gutter-lg">
      <template v-for="row in rows" :key="`${row.entity_type}:${row.id}`">
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2">
          <q-card flat bordered class="q-ma-none" style="min-height: 300px">
            <q-card-section
              class="q-pa-md"
              style="cursor: pointer"
              @click="onEntity(row)"
            >
              <div class="text-primary">{{ $t(row.entity_type) }}</div>
              <div class="text-h5">{{ row.name }}</div>
              <div>
                <tags-badges :document="row" />
              </div>
              <div class="text-body2">{{ row.description }}</div>
              <div v-if="getImageUrls(row).length">
                <q-img
                  :src="getImageUrls(row)[0]"
                  style="max-height: 100px; max-width: 100px"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
      <div v-if="rows.length === 0">
        {{ $t('no_results') }}
      </div>
    </div>
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
import TagsBadges from 'src/components/TagsBadges.vue';

const searchService = useSearchService();

const loading = computed(() => searchService.searching);
const rows = computed(() => searchService.results?.data || []);

function getImageUrls(row: Document) {
  const images = row.files
    ? row.files
        .filter((fileRef) => fileRef.ref.mime_type?.startsWith('image'))
        .map((fileRef) => `${cdnUrl}/${fileRef.ref.path}`)
    : [];
  console.log('getImageUrls', images);
  return images;
}

function onEntity(row: Document) {
  console.log('onEntity', row);
}
</script>
