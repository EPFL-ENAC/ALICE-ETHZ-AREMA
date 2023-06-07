<script setup lang='ts'>
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css'
import 'maplibre-gl/dist/maplibre-gl.css'

import { geocoderApi } from '~/utils/geocoder'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import * as MapboxDrawGeodesic from 'mapbox-gl-draw-geodesic'
import * as MapboxDrawWaypoint from 'mapbox-gl-draw-waypoint'
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
} from 'maplibre-gl'
import { onMounted, ref } from 'vue'

defineExpose({ drawPolygon, drawCircle, drawFeature, drawFeatures, drawTrash, deleteAll })
const props = withDefaults(
  defineProps<{
    center?: [number, number]
    zoom?: number
    aspectRatio?: number
    minZoom?: number
    maxZoom?: number
    height?: string
  }>(),
  {
    center: () => [8, 46.8],
    zoom: 7.5,
    aspectRatio: undefined,
    minZoom: undefined,
    maxZoom: undefined,
    height: '800px'
  }
)
const emit = defineEmits<{
  (e: 'update:selectedFeatures', value: Feature<Polygon | MultiPolygon>[]): void
}>()

const containerId = 'map-input-' + Math.random().toString(36).slice(2)
const loading = ref(false)
let map: Map | undefined = undefined
let draw: MapboxDraw | undefined = undefined

onMounted(() => {
  map = new Map({
    container: containerId,
    center: [props.center[0], props.center[1]],
    style: 'https://api.maptiler.com/maps/basic/style.json?key=kramlD0izE1YxWEKKCus',
    trackResize: true,
    zoom: props.zoom,
  })
  map.addControl(new NavigationControl({}))
  map.addControl(new GeolocateControl({}))
  map.addControl(new ScaleControl({}))
  map.addControl(new FullscreenControl({}))
  map.addControl(
    new MaplibreGeocoder(geocoderApi, {
      maplibregl: { Marker },
      showResultsWhileTyping: true,
    }),
    'top-left'
  )

  let modes = MapboxDraw.modes
  modes = MapboxDrawGeodesic.enable(modes)
  modes = MapboxDrawWaypoint.enable(modes)
  draw = new MapboxDraw({ 
    displayControlsDefault: false,
    modes
  })
  map.addControl(draw as unknown as IControl)
  
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

function drawFeature(feature: Feature<Polygon | MultiPolygon>) {
  if (MapboxDrawGeodesic.isCircle(feature)) {
    // a circle is not a geojson type, then prevent changes in representation using the geodesic API 
    const center = MapboxDrawGeodesic.getCircleCenter(feature)
    const radius = MapboxDrawGeodesic.getCircleRadius(feature)
    const circle = MapboxDrawGeodesic.createCircle(center, radius)
    draw?.deleteAll() // single circle
    draw?.add(circle)
  } else {
    draw?.add(feature)
  }
}

function drawFeatures(features: Feature<Polygon | MultiPolygon>[]) {
  if (features) {
    features.forEach(feature => drawFeature(feature))
  }
}

function drawPolygon() {
  draw?.changeMode('draw_polygon')
}

function drawCircle() {
  draw?.changeMode('draw_circle')
}

function deleteAll() {
  draw?.trash().deleteAll()
  updateArea()
}

function drawTrash() {
  draw?.trash()
  updateArea()
}
</script>

<template>
  <div>
    <v-progress-linear v-if='loading' :active='loading' indeterminate />
    <v-responsive :aspect-ratio='aspectRatio' height='100%'>
      <div :id="containerId" :style="'height:' + height"/>
    </v-responsive>
  </div>
</template>
