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
import { ref, watch, onMounted, unref } from 'vue'

const props = defineProps(['modelValue', 'center', 'zoom', 'height'])
const emit = defineEmits(['update:modelValue'])

const address = ref<string>()
const search = ref<string>()
const suggestions = ref<Feature[]>([])
const searching = ref<boolean>(false)

const mapInput = ref<InstanceType<typeof MapInput>>()
const selectedFeatures = ref<Feature<Polygon | MultiPolygon>[]>([])

const { t } = useI18n()

onMounted(() => {
  const feature = unref(props.modelValue)
  if (feature && feature.properties) {
    address.value = feature.properties.display_name
    mapInput.value?.drawFeature(feature)
  }
})

watch(selectedFeatures, async () => {
  if (selectedFeatures.value && selectedFeatures.value.length > 0) {
    const value = selectedFeatures.value.pop()
    const center = value.geometry.coordinates
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
    emit('update:modelValue', null)
  }
})

function edit() {
  mapInput.value?.deleteAll()
  mapInput.value?.drawPoint()
  address.value = undefined
}

function deleteAll() {
  mapInput.value?.deleteAll()
  address.value = undefined
  search.value = undefined
  suggestions.value = []
}

function updateWithLocation(location: Feature) {
  let value = unref(props.modelValue)
  if (!value)
    value = {
      type: 'Feature',
      properties: {}
    }
  value.properties = { ...location.properties }
  value.geometry = { ...location.geometry }
  mapInput.value?.drawFeature(value)
  emit('update:modelValue', value)
}

function lookupAddress() {
  if (search.value && search.value.length > 2) {
    searching.value = true
    geocoderApi.forwardGeocode({ query: search.value, limit: 5 }).then((collection) => {
      searching.value = false
      if (collection && collection.features && collection.features.length) {
        suggestions.value = collection.features //.map(feature => feature.properties.display_name)
      }
    })
  }
  else {
    suggestions.value = []
  }
}

const delayedLookupAddress = debounce(lookupAddress, 500)

watch(address, (newAddress) => {
  const location = suggestions.value.filter(feature => feature.properties.display_name === newAddress).pop()
  if (location)
    updateWithLocation(location)
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
        {{ $t('draw.point') }}
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
        item-title="text"
        hide-no-data
        auto-select-first
        menu
        prepend-inner-icon="mdi-office-building-marker"
      />
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
