<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-md-8">
      <map-view
        :features="searchService.features"
        :height="'600px'"
        :bbox="searchService.bbox"
        :mark="mark"
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
            <q-item
              clickable
              v-ripple
              @click="onDocument(row)"
              @mouseenter="onEnterDocument(row)"
              @mouseleave="onLeaveDocument"
            >
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

const router = useRouter();
const searchService = useSearchService();

const hoverDocument = ref<Document | null>(null);
const mark = ref<[number, number]>();
const rows = computed(() => searchService.geoResults?.data || []);

function onDocument(row: Document) {
  router.push({ name: 'doc', params: { id: `${row.entity_type}:${row.id}` } });
}

function onEnterDocument(row: Document) {
  hoverDocument.value = row;
  mark.value = [row.location?.lon || 0, row.location?.lat || 0];
}

function onLeaveDocument() {
  hoverDocument.value = null;
  mark.value = undefined;
}

function onBoundingBox(bounds: [[number, number], [number, number]]) {
  searchService.bbox = bounds;
  searchService.search_entities();
}
</script>
