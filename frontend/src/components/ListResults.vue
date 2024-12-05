<template>
  <div>
    <div class="q-mt-md">{{ searchService.selectedTerms }}</div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'MapResults',
});
</script>
<script setup lang="ts">
const searchService = useSearchService();
</script>
