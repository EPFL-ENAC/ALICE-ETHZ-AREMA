<script setup lang='ts'>
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css'
import 'maplibre-gl/dist/maplibre-gl.css'

import { geocoderApi } from '~/utils/geocoder'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import * as MapboxDrawGeodesic from 'mapbox-gl-draw-geodesic'
import * as MapboxDrawWaypoint from 'mapbox-gl-draw-waypoint';
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

defineExpose({ drawPolygon, drawCircle, drawTrash })
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

  let modes = MapboxDraw.modes
  modes = MapboxDrawGeodesic.enable(modes)
  modes = MapboxDrawWaypoint.enable(modes)
  draw = new MapboxDraw({ 
    displayControlsDefault: false,
    modes
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
})

function updateArea() {
  let selectedFeatures = draw?.getAll().features as Feature<Polygon | MultiPolygon>[]
  // filter out circle features that have a radius smaller than 100m 
  selectedFeatures = selectedFeatures.filter(feat => !feat.properties.circleRadius || feat.properties.circleRadius > 0.1)
  emit('update:selectedFeatures', selectedFeatures)
  // note: circle center and radius can be extracted using mapbox-gl-draw-geodesic API
  // https://github.com/zakjan/mapbox-gl-draw-geodesic#circle-geojson
}

function drawPolygon() {
  draw?.changeMode('draw_polygon')
}

function drawCircle() {
  draw?.changeMode('draw_circle')
}

function drawTrash() {
  draw?.trash().deleteAll()
  updateArea()
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
  width: 100%;
  height: 800px;
}
</style>
