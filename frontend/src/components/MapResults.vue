<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-md-6">
      <map-view :features="searchService.features" class="q-pr-md" />
    </div>
    <div class="col-12 col-md-6">
      <q-list separator>
        <template v-for="row in rows" :key="`${row.entity_type}:${row.id}`">
          <q-item clickable v-ripple @click="onDocument(row)">
            <q-item-section>
              <q-item-label class="text-primary">{{
                $t(row.entity_type)
              }}</q-item-label>
              <q-item-label class="text-bold">{{ row.name }}</q-item-label>
              <div>
                <tags-badges :document="row" />
              </div>
              <q-item-label caption>
                <q-markdown :src="row.description" />
              </q-item-label>
              <!-- <div v-if="getImageUrls(row).length">
                <q-carousel animated v-model="slide" arrows navigation infinite>
                  <template
                    v-for="(imageUrl, index) in getImageUrls(row)"
                    :key="imageUrl"
                  >
                    <q-carousel-slide :name="index + 1" :img-src="imageUrl" />
                  </template>
                </q-carousel>
              </div> -->
            </q-item-section>
          </q-item>
        </template>
      </q-list>
      <div v-if="!searchService.searching && rows.length === 0">
        {{ $t('no_results') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'MapResults',
});
</script>
<script setup lang="ts">
import MapView from 'src/components/MapView.vue';
import TagsBadges from 'src/components/TagsBadges.vue';
import { Document } from 'src/models';

const router = useRouter();
const searchService = useSearchService();

const rows = computed(() => searchService.geoResults?.data || []);

// function getImageUrls(row: Document) {
//   const images = row.files
//     ? row.files
//         .filter((fileRef) => fileRef.ref.mime_type?.startsWith('image'))
//         .map((fileRef) => `${cdnUrl}/${fileRef.ref.path}`)
//     : [];
//   return images;
// }

function onDocument(row: Document) {
  router.push({ name: 'doc', params: { id: `${row.entity_type}:${row.id}` } });
}
</script>
