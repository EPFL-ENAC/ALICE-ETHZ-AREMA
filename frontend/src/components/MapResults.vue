<template>
  <div ref="containerRef" class="row q-col-gutter-md">
    <div class="col-12 col-md-8">
      <map-view
        :features="searchService.features"
        :height="height"
        :bbox="searchService.bbox"
        :mark="mark"
        @map:box="onBoundingBox"
      />
    </div>
    <div class="col-12 col-md-4">
      <q-scroll-area :style="{ height: height }">
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
                <q-item-label class="text-primary text-uppercase">{{
                  t(row.entity_type)
                }}</q-item-label>
                <q-item-label class="text-bold">{{ row.name }}</q-item-label>
                <div>
                  <tags-badges :item="row" />
                </div>
                <q-item-label caption>
                  <q-markdown
                    :plugins="[noTermMarkdown]"
                    :src="row.description"
                    class="fade-text"
                    no-heading-anchor-links
                  />
                </q-item-label>
              </q-item-section>
              <q-item-section v-if="getImageUrls(row).length" avatar>
                <q-img
                  :src="getImageUrls(row)[0]"
                  height="100px"
                  fit="cover"
                  style="min-width: 100px"
                />
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWindowSize, useDebounceFn, useEventListener } from '@vueuse/core';
import MapView from '@/components/MapView.vue';
import TagsBadges from '@/components/TagsBadges.vue';
import type { Document } from '@/models';
import { getImageUrls } from '@/utils/files';
import { noTermMarkdown } from '@/utils/md';

const { t } = useI18n();
const router = useRouter();
const searchService = useSearchService();

const hoverDocument = ref<Document>();
const mark = ref<[number, number]>();
const containerRef = ref<HTMLElement>();
const containerTop = ref(0);
const { height: windowHeight } = useWindowSize();

function updateTop() {
  containerTop.value = containerRef.value?.getBoundingClientRect().top ?? 0;
}

const debouncedUpdateTop = useDebounceFn(updateTop, 100);

onMounted(updateTop);
watch(windowHeight, updateTop);
useEventListener(
  window,
  'scroll',
  () => {
    void debouncedUpdateTop();
  },
  { passive: true },
);

const rows = computed(() => searchService.geoResults?.data || []);
const height = computed(() => `${Math.max(600, windowHeight.value - containerTop.value - 100)}px`);

function onDocument(row: Document) {
  void router.push({ name: 'doc', params: { id: `${row.entity_type}:${row.id}` } });
}

function onEnterDocument(row: Document) {
  hoverDocument.value = row;
  mark.value = [row.location?.lon || 0, row.location?.lat || 0];
}

function onLeaveDocument() {
  hoverDocument.value = undefined;
  mark.value = undefined;
}

function onBoundingBox(bounds: [[number, number], [number, number]]) {
  searchService.bbox = bounds;
  void searchService.search_entities();
}
</script>
