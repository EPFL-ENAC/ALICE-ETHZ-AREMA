<script setup lang="ts">
import MapInput from '~/components/MapInput.vue'
import {
  type Feature,
  type MultiPolygon,
  type Polygon,
} from '@turf/turf'
import { ref, watch, onMounted, unref } from 'vue'

const props = defineProps(['modelValue', 'center', 'zoom', 'height'])
const emit = defineEmits(['update:modelValue'])

const mapInput = ref<InstanceType<typeof MapInput>>()

const selectedFeatures = ref<Feature<Polygon | MultiPolygon>[]>([])

onMounted(() => {
  const featureCollection = unref(props.modelValue)
  if (featureCollection && featureCollection.features) {
    mapInput.value?.drawFeatures(featureCollection.features)
  }
})

watch(selectedFeatures, async () => {
  if (selectedFeatures.value && selectedFeatures.value.length > 0) {
    const value = selectedFeatures.value
    emit('update:modelValue', {
      type: 'FeatureCollection',
      features: value
    })
  }
  else {
    emit('update:modelValue', null)
  }
})

function edit() {
  mapInput.value?.drawPolygon()
}
</script>

<template>
  <v-row>
    <v-col cols='12'>
      <v-btn
        class="ma-3"
        color="primary"
        @click='edit()'
      >
        {{ $t('draw.polygon') }}
      </v-btn>
      <v-btn
        class="ma-3"
        color="primary"
        v-if='modelValue'
        @click='mapInput?.drawTrash()'
      >
        {{ $t('draw.trash') }}
      </v-btn>
      <v-btn
        class="ma-3"
        color="primary"
        v-if='modelValue'
        @click='mapInput?.deleteAll()'
      >
        {{ $t('draw.deleteAll') }}
      </v-btn>
      <MapInput
        ref="mapInput"
        :center="center"
        :zoom="zoom"
        :height="height"
        @update:selected-features="selectedFeatures = $event"
      />
    </v-col>
  </v-row>
</template>

<style>
.maplibre-component {
  height: 250px;
}
</style>