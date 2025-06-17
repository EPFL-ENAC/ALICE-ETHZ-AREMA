<template>
  <div>
    <div>
      <div v-if="!loading" class="row q-col-gutter-lg">
        <template v-for="row in rows" :key="`${row.entity_type}:${row.id}`">
          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2">
            <q-card flat bordered class="q-ma-none">
              <q-card-section class="q-pa-md" style="cursor: pointer; height: 100%" @click="onDocument(row)">
                <div class="text-primary">{{ $t(row.entity_type) }}</div>
                <div class="text-h5">{{ row.name }}</div>
                <div>
                  <tags-badges :item="row" />
                </div>
                <q-markdown :src="row.description" class="fade-text" />
                <div v-if="getImageUrls(row).length" class="q-mt-md">
                  <q-img :src="getImageUrls(row)[0]" height="100px" style="max-width: 100%" fit="cover" />
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
    <div v-if="count < total" class="q-mt-md">
      <q-btn color="primary" unelevated square no-caps size="md" :label="$t('show_more')" @click="loadMore" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Document } from 'src/models';
import TagsBadges from 'src/components/TagsBadges.vue';
import { getImageUrls } from 'src/utils/files';

const searchService = useSearchService();
const router = useRouter();

const total = computed(() => searchService.results?.total || 0);
const count = computed(() => searchService.results?.data?.length || 0);
const loading = computed(() => searchService.searching);
const rows = computed(() => searchService.results?.data || []);

function onDocument(row: Document) {
  router.push({ name: 'doc', params: { id: `${row.entity_type}:${row.id}` } });
}

function loadMore() {
  searchService.search_entities(searchService.limit + 100);
}
</script>
