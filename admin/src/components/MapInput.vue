<script lang='ts'>
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import 'maplibregl-theme-switcher/styles.css';
import { geocoderApi } from '../utils/geocoder'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import * as MapboxDrawGeodesic from 'mapbox-gl-draw-geodesic'
import * as MapboxDrawWaypoint from 'mapbox-gl-draw-waypoint'
import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder'
import { ThemeSwitcherControl, ThemeDefinition } from 'maplibregl-theme-switcher';
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
  StyleSpecification,
  type IControl,
} from 'maplibre-gl'
import { defineComponent, onMounted } from 'vue'

const style: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.osm.ch/osm-swiss-style/{z}/{x}/{y}.png'],
      tileSize: 256,
      minzoom: 0,
      maxzoom: 20
    },
    swissimage: {
      type: 'raster',
      tiles: ['https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage-product/default/current/3857/{z}/{x}/{y}.jpeg']
    }
  },
  layers: [
    {
      id: 'classic',
      type: 'raster',
      source: 'osm',
      layout: { visibility: 'none' }
    },
    { id: 'light',
      type: 'raster',
      source: 'osm',
      paint: {
        'raster-saturation': -0.9,
        'raster-brightness-min': 0.7
      }
    },
    { id: 'dark',
      type: 'raster',
      source: 'osm',
      paint: {
        'raster-saturation': -1,
        'raster-brightness-max': 0.2
      },
      layout: { visibility: 'none' }
    },
    { id: 'swissimage',
      type: 'raster',
      source: 'swissimage',
      layout: { visibility: 'none' }
    }
  ]
}

export default defineComponent({
  name: 'MapInput',
  props: {
    center: {
      type: Array<number>,
      default: () => [8, 46.8]
    },
    zoom: {
      type: Number,
      default: 8
    },
    aspectRatio: {
      type: Number,
      default: undefined
    },
    minZoom: {
      type: Number
    },
    maxZoom: {
      type: Number
    },
    height: {
      type: String,
      default: '800px'
    }
  },
  emits: ['update:selectedFeatures'],
  setup(props, { emit }) {
    const { t, locale } = useI18n({ useScope: 'global' });

    const containerId = 'map-input-' + Math.random().toString(36).slice(2)
    let map: Map | undefined = undefined
    let draw: MapboxDraw | undefined = undefined

    onMounted(() => {
      map = new Map({
        container: containerId,
        center: [props.center[0], props.center[1]],
        style: style,
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
          language: locale.value,
        }),
        'top-left'
      )
      const themes: ThemeDefinition[] = [
        {
          id: 'classic',
          label: t('classic')
        },
        {
          id:'light',
          label: t('light')
        },
        {
          id:'dark',
          label: t('dark')
        },
        {
          id: 'swissimage',
          label: t('aerial')
        }
      ];
      map.addControl(new ThemeSwitcherControl(themes));

      let modes = MapboxDraw.modes
      modes = MapboxDrawGeodesic.enable(modes)
      modes = MapboxDrawWaypoint.enable(modes)
      draw = new MapboxDraw({ 
        displayControlsDefault: false,
        modes
      })
      map.addControl(draw as unknown as IControl)
      
      map.on('draw.add', updateArea)
      map.on('draw.create', updateArea)
      map.on('draw.delete', updateArea)
      map.on('draw.update', updateArea)
    })

    function updateArea() {
      let selectedFeatures = draw?.getAll().features as Feature<Polygon | MultiPolygon>[]
      // filter out circle features that have a radius smaller than 100m 
      selectedFeatures = selectedFeatures.filter(feat => !feat.properties || !feat.properties.circleRadius || feat.properties.circleRadius > 0.1)
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
        map?.setCenter(circle.geometry.coordinates[0][0])
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

    function drawPoint() {
      draw?.changeMode('draw_point')
    }

    function deleteAll() {
      draw?.trash().deleteAll()
      updateArea()
    }

    function drawTrash() {
      draw?.trash()
      updateArea()
    }

    return {
      containerId,
      drawPolygon,
      drawCircle,
      drawPoint,
      drawFeature,
      drawFeatures,
      drawTrash,
      deleteAll
    }
  },
});

</script>

<template>
  <div>
    <div :id="containerId" :style="`--t-height: ${height}`" class="mapinput"/>
  </div>
</template>

<style scoped>
.mapinput {
  height: var(--t-height)
}
</style>
