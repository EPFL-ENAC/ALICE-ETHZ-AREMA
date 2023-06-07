<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { round } from 'lodash'
import MapInput from '~/components/MapInput.vue'
import * as MapboxDrawGeodesic from 'mapbox-gl-draw-geodesic'
import { geocoderApi } from '~/utils/geocoder'
import {
  type Feature,
  type MultiPolygon,
  type Polygon,
} from '@turf/turf'
import { ref, watch, onMounted, unref } from 'vue'

const props = defineProps(['modelValue', 'center', 'zoom', 'height'])
const emit = defineEmits(['update:modelValue'])

const mapInput = ref<InstanceType<typeof MapInput>>()
const radius = ref<number>(0)
const minRadius = 1
const maxRadius = 1000
const rules = [ 
    v => ( v && v >= minRadius ) || t('minRadiusValid', { n: minRadius }),
    v => ( v && v <= maxRadius ) || t('maxRadiusValid', { n: maxRadius }),
]
const selectedFeatures = ref<Feature<Polygon | MultiPolygon>[]>([])

const { t } = useI18n()

onMounted(() => {
  const feature = unref(props.modelValue)
  if (feature && feature.properties) {
    radius.value = feature.properties.circleRadius
    mapInput.value?.drawFeature(feature)
  }
})

watch(selectedFeatures, async () => {
  if (selectedFeatures.value && selectedFeatures.value.length > 0) {
    const value = selectedFeatures.value.pop()
    value.properties.circleRadius = round(value.properties.circleRadius, 0)
    radius.value = value.properties.circleRadius
    const center = MapboxDrawGeodesic.getCircleCenter(unref(value))
    geocoderApi.reverseGeocode({ query: { lon: center[0], lat: center[1] } }).then((collection) => {
      if (collection && collection.features && collection.features.length) {
        const location = collection.features.pop()
        value.properties = { circleRadius: value.properties.circleRadius, ...location.properties}
      }
      emit('update:modelValue', value)
    })
  }
  else {
    radius.value = 0
    emit('update:modelValue', null)
  }
})

watch(radius, async () => {
  const feature = unref(props.modelValue)
  const rd = radius.value
  if (feature && feature.properties.circleRadius !== rd && rd >= minRadius && maxRadius <= maxRadius) {
    feature.properties.circleRadius = rd
    mapInput.value?.drawFeature(feature)
  }
})

function edit() {
  mapInput.value?.deleteAll()
  mapInput.value?.drawCircle()
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
        {{ $t('draw.circle') }}
      </v-btn>
      <v-btn
        class="ma-3"
        color="primary"
        v-if='modelValue'
        @click='mapInput?.deleteAll()'
      >
        {{ $t('draw.trash') }}
      </v-btn>
      <v-text-field 
        :label="$t('radius')"
        type="number"
        :rules = rules
        v-model.number="radius">
      </v-text-field>
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
