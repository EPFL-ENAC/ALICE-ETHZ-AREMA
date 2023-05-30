<script setup lang='ts'>
import { onMounted, ref, unref } from 'vue'
import MapLibreMap from '~/components/MapLibreMap.vue'

const props = defineProps(['modelValue', 'center', 'zoom'])

const mapLibreMap = ref<InstanceType<typeof MapLibreMap>>()

onMounted(() => {
  mapLibreMap.value?.drawFeatures(unref(props.modelValue))
})
</script>

<template>
  <v-row>
    <v-col cols='12'>
      <MapLibreMap
        ref='mapLibreMap'
        :center="center"
        :zoom="zoom"
      />
    </v-col>
  </v-row>
</template>
