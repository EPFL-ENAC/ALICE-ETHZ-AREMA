<script setup lang="ts">
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css'
import 'maplibre-gl/dist/maplibre-gl.css'

import { geocoderApi } from '~/utils/geocoder'
import * as MapboxDrawGeodesic from 'mapbox-gl-draw-geodesic'
import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder'
import {
  type Feature,
  type MultiPolygon,
  type Polygon,
  center,
  circle,
  FeatureCollection,
} from '@turf/turf'
import {
  FullscreenControl,
  GeolocateControl,
  Map,
  Marker,
  NavigationControl,
  ScaleControl,
  Popup
} from 'maplibre-gl'
import { shallowRef, onMounted, onUnmounted, markRaw, ref, watch, unref } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: [Feature<Polygon | MultiPolygon>[] | Feature<Polygon | MultiPolygon>]
    center?: [number, number]
    zoom?: number
    aspectRatio?: number
    minZoom?: number
    maxZoom?: number
  }>(),
  {
    center: () => [8, 46.8],
    zoom: 7.5,
    aspectRatio: undefined,
    minZoom: undefined,
    maxZoom: undefined,
  }
)
defineEmits(['update:modelValue'])
const loading = ref(false)
const map= shallowRef<Map | undefined>(undefined)

onMounted(() => {
  map.value = markRaw(new Map({
    container: 'map-view',
    center: [props.center[0], props.center[1]],
    style: 'https://api.maptiler.com/maps/basic/style.json?key=kramlD0izE1YxWEKKCus',
    trackResize: true,
    zoom: props.zoom,
  }))
  map.value.addControl(new NavigationControl({}))
  map.value.addControl(new GeolocateControl({}))
  map.value.addControl(new ScaleControl({}))
  map.value.addControl(new FullscreenControl({}))
  map.value.addControl(
    new MaplibreGeocoder(geocoderApi, {
      maplibregl: { Marker },
      showResultsWhileTyping: true,
    }),
    'top-left'
  )
  map.value.on('load', function() {
    displayFeatures()
  })
})

onUnmounted(() => {
  // map.value?.remove();
})

watch(props.modelValue, () => {
  displayFeatures()
})

function displayFeatures() {
  const features = unref(props.modelValue)
  if (features) {
    features.map(f => unref(f)).forEach(feature => {
      if (feature.type === 'FeatureCollection') {
        displayPolygons(feature)
      } else if (MapboxDrawGeodesic.isCircle(feature)) {
        displayCircle(feature) 
      }
    })
  }
}

function displayCircle(feature: Feature<Polygon>) {
  // a circle is not a geojson type, then prevent changes in representation using the geodesic API 
  const center = MapboxDrawGeodesic.getCircleCenter(feature)
  const radius = MapboxDrawGeodesic.getCircleRadius(feature)
  const popup = new Popup({
    closeButton: false,
    offset: 25
  }).setText(`Radius: ${radius}`)
  new Marker({color: '#FF0000'})
    .setLngLat(center)
    .setPopup(popup)
    .addTo(map.value)

  // Generate a polygon using turf.circle.
  // See https://turfjs.org/docs/#circle
  const options = {
    steps: 64,
    units: 'kilometers'
  }
  const cc = circle(center, radius, options)

  // Add a fill layer with some transparency.
  const color = randomColor()
  map.value.addLayer({
    id: feature.id,
    type: 'fill',
    source: {
      type: 'geojson',
      data: cc
    },
    paint: {
      'fill-color': color,
      'fill-opacity': 0.5,
    }
  })
  // Add a line layer to draw the circle outline
  map.value.addLayer({
    id: `${feature.id}-outline`,
    type: 'line',
    source: {
      type: 'geojson',
      data: cc
    },
    paint: {
      'line-color': '#0094ff',
      'line-width': 2
    }
  })
}

function displayPolygons(featureCollection: Feature<FeatureCollection>) {
  const ct = center(featureCollection)
  const popup = new Popup({
    closeButton: false,
    offset: 25
  }).setText(`Zones: ${featureCollection.features.length}`)
  new Marker({color: '#FF0000'})
    .setLngLat(ct.geometry.coordinates)
    .setPopup(popup)
    .addTo(map.value)

  const color = randomColor()
  featureCollection.features.forEach(feature => {
    // Add a fill layer with some transparency.
    map.value.addLayer({
      id: feature.id,
      type: 'fill',
      source: {
        type: 'geojson',
        data: feature
      },
      paint: {
        'fill-color': color,
        'fill-opacity': 0.5,
      }
    })
    // Add a line layer to draw the circle outline
    map.value.addLayer({
      id: `${feature.id}-outline`,
      type: 'line',
      source: {
        type: 'geojson',
        data: feature
      },
      paint: {
        'line-color': '#0094ff',
        'line-width': 2
      }
    })
  })
}

function randomColor() {
  return `#${(0x1000000+Math.random()*0xffffff).toString(16).substring(1,7)}`
}
</script>

<template>
  <div>
    <v-progress-linear v-if="loading" :active="loading" indeterminate />
    <v-responsive :aspect-ratio="aspectRatio" height="100%">
      <div id="map-view" />
    </v-responsive>
  </div>
</template>

<style scoped>
#map-view {
  width: 100%;
  height: 800px;
}
</style>
