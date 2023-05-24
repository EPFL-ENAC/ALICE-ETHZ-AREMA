<script setup lang='ts'>
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css'
import 'maplibre-gl/dist/maplibre-gl.css'

import { geocoderApi } from '~/utils/geocoder'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder'
import {
  type Feature,
  type MultiPolygon,
  type Polygon,
} from '@turf/turf'
import {
  FullscreenControl,
  GeolocateControl,
  Map,
  Marker,
  NavigationControl,
  ScaleControl,
  type IControl,
  type StyleSpecification,
} from 'maplibre-gl'
import { onMounted, ref } from 'vue'

defineExpose({ drawPolygon, drawTrash })
const props = withDefaults(
  defineProps<{
    styleSpec: string | StyleSpecification
    center?: [number, number]
    zoom?: number
    aspectRatio?: number
    minZoom?: number
    maxZoom?: number
  }>(),
  {
    center: () => [0, 0],
    zoom: 10,
    aspectRatio: undefined,
    minZoom: undefined,
    maxZoom: undefined,
  }
)
const emit = defineEmits<{
  (e: 'update:selectedFeatures', value: Feature<Polygon | MultiPolygon>[]): void
}>()

const loading = ref(false)
let map: Map | undefined = undefined
let draw: MapboxDraw | undefined = undefined

onMounted(() => {
  map = new Map({
    container: 'maplibre-map',
    center: [props.center[0], props.center[1]],
    style: props.styleSpec,
    trackResize: true,
    zoom: props.zoom,
  })
  map.addControl(new NavigationControl({}))
  map.addControl(new GeolocateControl({}))
  map.addControl(new ScaleControl({}))
  map.addControl(new FullscreenControl({}))
  draw = new MapboxDraw({
    displayControlsDefault: false,
  })
  map.addControl(draw as unknown as IControl)
  map.addControl(
    new MaplibreGeocoder(geocoderApi, {
      maplibregl: { Marker },
      showResultsWhileTyping: true,
    }),
    'top-left'
  )

  map.on('draw.create', updateArea)
  map.on('draw.delete', updateArea)
  map.on('draw.update', updateArea)

  function updateArea() {
    const selectedFeatures = draw?.getAll().features as Feature<
      Polygon | MultiPolygon
    >[]
    emit('update:selectedFeatures', selectedFeatures)
  }

})

function drawPolygon() {
  draw?.changeMode('draw_polygon')
}

function drawTrash() {
  draw?.trash()
}
</script>

<template>
  <div>
    <v-progress-linear v-if='loading' :active='loading' indeterminate />
    <v-responsive :aspect-ratio='aspectRatio' height='100%'>
      <div id='maplibre-map' />
    </v-responsive>
  </div>
</template>

<style scoped>
#maplibre-map {
  height: 800px
}
</style>
