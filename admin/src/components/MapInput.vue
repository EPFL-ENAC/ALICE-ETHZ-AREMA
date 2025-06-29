<script lang="ts">
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import 'maplibregl-theme-switcher/styles.css';
// import { geocoderApi } from '../utils/geocoder';
import { style, themes } from '../utils/maps';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as MapboxDrawGeodesic from 'mapbox-gl-draw-geodesic';
import * as MapboxDrawWaypoint from 'mapbox-gl-draw-waypoint';
// import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder';
import { ThemeSwitcherControl } from 'maplibregl-theme-switcher';
import { type Feature, type MultiPolygon, type Polygon, type Point } from '@turf/turf';
import {
  AttributionControl,
  FullscreenControl,
  GeolocateControl,
  Map,
  // Marker,
  NavigationControl,
  ScaleControl,
  type IControl,
} from 'maplibre-gl';
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'MapInput',
  props: {
    center: {
      type: Array<number>,
      default: () => [6.62887615, 46.5325242],
    },
    zoom: {
      type: Number,
      default: 8,
    },
    aspectRatio: {
      type: Number,
      default: undefined,
    },
    minZoom: {
      type: Number,
    },
    maxZoom: {
      type: Number,
    },
    height: {
      type: String,
      default: '400px',
    },
  },
  emits: ['update:selectedFeatures'],
  setup(props, { emit }) {
    // const { locale } = useI18n({ useScope: 'global' });

    const containerId = 'map-input-' + Math.random().toString(36).slice(2);
    let map: Map | undefined = undefined;
    let draw: MapboxDraw | undefined = undefined;

    onMounted(() => {
      map = new Map({
        container: containerId,
        center: [props.center[0], props.center[1]],
        style: style,
        trackResize: true,
        zoom: props.zoom,
        attributionControl: false,
      });
      map.addControl(new NavigationControl({}));
      map.addControl(new GeolocateControl({}));
      map.addControl(new ScaleControl({}));
      map.addControl(new FullscreenControl({}));
      map.addControl(
        new AttributionControl({
          compact: false,
          customAttribution:
            '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>, <a href="https://sc.ibi.ethz.ch/en/" target="_blank">IBI SC</a>, <a href="https://www.epfl.ch/labs/alice/" target="_blank">ENAC ALICE</a>',
        }),
      );
      // map.addControl(
      //   new MaplibreGeocoder(geocoderApi, {
      //     maplibregl: { Marker },
      //     showResultsWhileTyping: true,
      //     language: locale.value,
      //   }),
      //   'top-left',
      // );
      map.addControl(new ThemeSwitcherControl(themes, themes[0].id));

      let modes = MapboxDraw.modes;
      modes = MapboxDrawGeodesic.enable(modes);
      modes = MapboxDrawWaypoint.enable(modes);
      draw = new MapboxDraw({
        displayControlsDefault: false,
        modes,
      });
      map.addControl(draw as unknown as IControl);

      map.on('draw.add', updateArea);
      map.on('draw.create', updateArea);
      map.on('draw.delete', updateArea);
      map.on('draw.update', updateArea);
    });

    function updateArea() {
      let selectedFeatures = draw?.getAll().features as Feature<Polygon | MultiPolygon>[];
      // filter out circle features that have a radius smaller than 100m
      selectedFeatures = selectedFeatures.filter(
        (feat) => !feat.properties || !feat.properties.circleRadius || feat.properties.circleRadius > 0.1,
      );
      emit('update:selectedFeatures', selectedFeatures);
      // note: circle center and radius can be extracted using mapbox-gl-draw-geodesic API
      // https://github.com/zakjan/mapbox-gl-draw-geodesic#circle-geojson
    }

    function drawFeature(feature: Feature<Point | Polygon | MultiPolygon>) {
      if (MapboxDrawGeodesic.isCircle(feature)) {
        // a circle is not a geojson type, then prevent changes in representation using the geodesic API
        const center = MapboxDrawGeodesic.getCircleCenter(feature);
        const radius = MapboxDrawGeodesic.getCircleRadius(feature);
        const circle = MapboxDrawGeodesic.createCircle(center, radius);
        draw?.deleteAll(); // single circle
        draw?.add(circle);
        map?.setCenter(circle.geometry.coordinates[0][0]);
      } else {
        draw?.add(feature);
      }
    }

    function drawFeatures(features: Feature<Point | Polygon | MultiPolygon>[]) {
      if (features) {
        features.forEach((feature) => drawFeature(feature));
      }
    }

    function drawPolygon() {
      draw?.changeMode('draw_polygon');
    }

    function drawCircle() {
      draw?.changeMode('draw_circle');
    }

    function drawPoint() {
      draw?.changeMode('draw_point');
    }

    function deleteAll() {
      draw?.trash().deleteAll();
      updateArea();
    }

    function drawTrash() {
      draw?.trash();
      updateArea();
    }

    return {
      containerId,
      drawPolygon,
      drawCircle,
      drawPoint,
      drawFeature,
      drawFeatures,
      drawTrash,
      deleteAll,
    };
  },
});
</script>

<template>
  <div>
    <div :id="containerId" :style="`--t-height: ${height}`" class="mapinput" />
  </div>
</template>

<style scoped>
.mapinput {
  height: var(--t-height);
}
</style>
