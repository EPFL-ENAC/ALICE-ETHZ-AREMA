<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-md-8">
      <map-view
        :features="searchService.features"
        :height="'600px'"
        class="q-pr-md"
        @map:click="onFeature"
        @map:box="onBoundingBox"
      />
    </div>
    <div class="col-12 col-md-4">
      <div v-if="!searchService.searching && rows.length === 0">
        {{ $t('no_results') }}
      </div>
      <q-scroll-area v-else style="height: 600px">
        <q-list separator>
          <template v-for="row in rows" :key="`${row.entity_type}:${row.id}`">
            <q-item clickable v-ripple @click="onDocument(row)">
              <q-item-section>
                <q-item-label class="text-primary text-uppercase">{{ $t(row.entity_type) }}</q-item-label>
                <q-item-label class="text-bold">{{ row.name }}</q-item-label>
                <div>
                  <tags-badges :item="row" />
                </div>
                <q-item-label caption>
                  <q-markdown :src="row.description" class="fade-text" no-heading-anchor-links />
                </q-item-label>
              </q-item-section>
              <q-item-section v-if="getImageUrls(row).length" avatar>
                <q-img :src="getImageUrls(row)[0]" height="100px" fit="cover" style="min-width: 100px" />
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </div>
  </div>
</template>

<script setup lang="ts">
import MapView from 'src/components/MapView.vue';
import TagsBadges from 'src/components/TagsBadges.vue';
import { Document } from 'src/models';
import { getImageUrls } from 'src/utils/files';
import { Feature } from 'geojson';

const router = useRouter();
const searchService = useSearchService();

const rows = computed(() => searchService.geoResults?.data || []);

function onDocument(row: Document) {
  router.push({ name: 'doc', params: { id: `${row.entity_type}:${row.id}` } });
}

function onFeature(feature: Feature) {
  console.log(feature);
}

function onBoundingBox(bounds: [[number, number], [number, number]]) {
  searchService.bbox = bounds;
  searchService.search_entities();
}
</script>
