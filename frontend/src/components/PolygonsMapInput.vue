<script setup lang='ts'>
import MapLibreMap from '~/components/MapLibreMap.vue'
import {
  type Feature,
  type MultiPolygon,
  type Polygon,
} from '@turf/turf'
import { ref, watch, onMounted, unref } from 'vue'

const props = defineProps(['modelValue', 'center', 'zoom'])
const emit = defineEmits(['update:modelValue'])

const mapLibreMap = ref<InstanceType<typeof MapLibreMap>>()

const selectedFeatures = ref<Feature<Polygon | MultiPolygon>[]>([])

onMounted(() => {
  mapLibreMap.value?.drawFeatures(unref(props.modelValue))
})

watch(selectedFeatures, async () => {
  if (selectedFeatures.value && selectedFeatures.value.length > 0) {
    const value = selectedFeatures.value
    emit('update:modelValue', value)
  }
  else {
    emit('update:modelValue', null)
  }
})

function edit() {
  mapLibreMap.value?.drawPolygon()
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
        @click='mapLibreMap?.drawTrash()'
      >
        {{ $t('draw.trash') }}
      </v-btn>
      <v-btn
        class="ma-3"
        color="primary"
        v-if='modelValue'
        @click='mapLibreMap?.deleteAll()'
      >
        {{ $t('draw.deleteAll') }}
      </v-btn>
      <MapLibreMap
        ref='mapLibreMap'
        :center='center'
        :zoom='zoom'
        @update:selected-features='selectedFeatures = $event'
      />
    </v-col>
  </v-row>
</template>
