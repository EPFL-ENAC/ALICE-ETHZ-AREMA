<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { debounce, round } from 'lodash'
import MapInput from '~/components/MapInput.vue'
import * as MapboxDrawGeodesic from 'mapbox-gl-draw-geodesic'
import { geocoderApi } from '~/utils/geocoder'
import {
  type Feature,
  type MultiPolygon,
  type Polygon,
} from '@turf/turf'
import { computed, ref, watch, onMounted, unref } from 'vue'

const props = defineProps(['modelValue', 'center', 'zoom', 'height'])
const emit = defineEmits(['update:modelValue'])

const address = ref<string>()
const search = ref<string>()
const suggestions = ref<string[]>([])
const searching = ref<boolean>(false)

const mapInput = ref<InstanceType<typeof MapInput>>()
const radius = ref<number>(10)
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
    address.value = feature.properties.display_name
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
      address.value = value.properties.display_name
      emit('update:modelValue', value)
    })
  }
  else {
    radius.value = 10
    emit('update:modelValue', null)
  }
})

watch(radius, () => {
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
  address.value = undefined
}

function deleteAll() {
  mapInput.value?.deleteAll()
  address.value = undefined
  search.value = undefined
}

function updateWithLocation(location) {
  let value = unref(props.modelValue)
  if (!value)
    value = {
      type: 'Feature',
      properties: {
        circleRadius: radius.value
      }
    }
  value.properties = { circleRadius: value.properties.circleRadius, ...location.properties}
  value.geometry = {
    type: "Polygon",
    coordinates: [[location.center, location.center, location.center, location.center]]
  }
  mapInput.value?.drawFeature(value)
  emit('update:modelValue', value)
}

function lookupAddress() {
  if (search.value && search.value.length > 3) {
    searching.value = true
    geocoderApi.forwardGeocode({ query: search.value, limit: 3 }).then((collection) => {
      searching.value = false
      if (collection && collection.features && collection.features.length) {
        suggestions.value = collection.features.map(feature => feature.properties.display_name)
        const location = collection.features.pop()
        updateWithLocation(location)
      }
    })
  }
}

const delayedLookupAddress = debounce(lookupAddress, 500)

watch(address, () => {
  console.log(address)
})

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
        @click='deleteAll()'
      >
        {{ $t('draw.trash') }}
      </v-btn>
      <v-autocomplete
        v-model="address"
        v-model:search="search"
        @update:search="delayedLookupAddress"
        :items="suggestions"
        :loading="searching"
        :label="$t('address')"
        hide-no-data
        auto-select-first
        prepend-inner-icon="mdi-office-building-marker"
      />
      <v-text-field 
        :label="$t('radius')"
        type="number"
        :rules = rules
        v-model.number="radius"
        prepend-inner-icon="mdi-radius">
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
