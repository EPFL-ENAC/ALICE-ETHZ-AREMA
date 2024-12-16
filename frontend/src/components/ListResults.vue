<template>
  <div>
    <div>
      <results-grid />
    </div>
    <div v-if="count < total" class="q-mt-md">
      <q-btn
        color="primary"
        unelevated
        square
        no-caps
        size="md"
        :label="$t('show_more')"
        @click="loadMore"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'MapResults',
});
</script>
<script setup lang="ts">
import ResultsGrid from 'src/components/ResultsGrid.vue';
const searchService = useSearchService();

const total = computed(() => searchService.results?.total || 0);
const count = computed(() => searchService.results?.data?.length || 0);

function loadMore() {
  searchService.search(searchService.limit + 100);
}
</script>
