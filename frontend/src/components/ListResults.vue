<template>
  <div>
    <div>
      {{ $t('showing_results', { count, total }) }}
    </div>
    <div class="q-mt-md">
      <results-grid />
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
</script>
