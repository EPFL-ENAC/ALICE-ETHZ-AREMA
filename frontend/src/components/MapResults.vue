<template>
  <div class="row q-col-gutter-md">
    <div class="col">
      <map-view class="q-pr-md a-map" />
    </div>
    <div class="col">
      <div>{{ searchService.selectedTerms }}</div>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'MapResults',
});
</script>
<script setup lang="ts">
import MapView from './MapView.vue';
const searchService = useSearchService();
</script>
