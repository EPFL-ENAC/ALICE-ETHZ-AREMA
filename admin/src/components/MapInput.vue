<template>
  <div>
    <div :id="containerId" :style="`--t-height: ${height}`" class="mapinput" />
  </div>
</template>

<script setup lang="ts">
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import 'maplibregl-theme-switcher/styles.css';
import { style, themes } from '../utils/maps';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as MapboxDrawGeodesic from 'mapbox-gl-draw-geodesic';
import * as MapboxDrawWaypoint from 'mapbox-gl-draw-waypoint';
import { ThemeSwitcherControl } from 'maplibregl-theme-switcher';
import type { Feature, MultiPolygon, Polygon, Point } from 'geojson';
import {
  AttributionControl,
  FullscreenControl,
  GeolocateControl,
  Map,
  Marker,
  NavigationControl,
  ScaleControl,
  type IControl,
} from 'maplibre-gl';

interface Props {
  feature: Feature<Point | Polygon | MultiPolygon> | null | undefined;
  mode: string | undefined | null;
  center?: [number, number] | undefined;
  zoom?: number | undefined;
  aspectRatio?: number | undefined;
  minZoom?: number | undefined;
  maxZoom?: number | undefined;
  height: string;
  disable?: boolean | undefined;
}

const props = withDefaults(defineProps<Props>(), {
  center: () => [6.62887615, 46.5325242],
  zoom: 8,
  height: '400px',
});

const emit = defineEmits(['update:selectedFeatures']);

const containerId = 'map-input-' + Math.random().toString(36).slice(2);
let map: Map | undefined = undefined;
let draw: MapboxDraw | undefined = undefined;
let marker: Marker | undefined = undefined;

onMounted(() => {
  map = new Map({
    container: containerId,
    center: [props.center[0] || 0, props.center[1] || 0],
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
  map.addControl(new ThemeSwitcherControl(themes, themes[0]?.id));

  let modes = MapboxDraw.modes;
  modes = MapboxDrawGeodesic.enable(modes);
  modes = MapboxDrawWaypoint.enable(modes);
  draw = new MapboxDraw({
    displayControlsDefault: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modes: modes as any,
  });
  map.addControl(draw as unknown as IControl);

  if (props.disable !== true) {
    map.on('draw.add', updateArea);
    map.on('draw.create', updateArea);
    map.on('draw.delete', updateArea);
    map.on('draw.update', updateArea);
  }
  applyMode();
  if (props.feature) {
    deleteAll();
    drawFeature(props.feature);
  }
});

watch(
  () => props.feature,
  (newFeature) => {
    if (newFeature) {
      drawFeature(newFeature);
    } else {
      deleteAll();
    }
  },
  { immediate: true },
);

function applyMode() {
  switch (props.mode) {
    case 'draw_polygon':
      drawPolygon();
      break;
    case 'draw_circle':
      drawCircle();
      break;
    case 'draw_point':
      drawPoint();
      break;
    default:
      drawTrash();
  }
}

function updateArea() {
  let selectedFeatures = draw?.getAll().features as Feature<Polygon | MultiPolygon>[];
  if (!selectedFeatures || selectedFeatures.length === 0) {
    //emit('update:selectedFeatures', []);
    return;
  }
  // filter out circle features that have a radius smaller than 100m
  selectedFeatures = selectedFeatures.filter(
    (feat) =>
      !feat.properties || !feat.properties.circleRadius || feat.properties.circleRadius > 0.1,
  );
  emit('update:selectedFeatures', selectedFeatures);
  // note: circle center and radius can be extracted using mapbox-gl-draw-geodesic API
  // https://github.com/zakjan/mapbox-gl-draw-geodesic#circle-geojson
}

function drawFeature(feature: Feature<Point | Polygon | MultiPolygon>) {
  if (!draw || !map) {
    console.error('Map or draw instance is not initialized');
    return;
  }
  if (marker) {
    marker.remove();
    marker = undefined;
  }
  if (!feature || !feature.geometry || !feature.geometry.coordinates) {
    deleteAll();
    return;
  }
  if (MapboxDrawGeodesic.isCircle(feature)) {
    // a circle is not a geojson type, then prevent changes in representation using the geodesic API
    const center = MapboxDrawGeodesic.getCircleCenter(feature);
    const radius = MapboxDrawGeodesic.getCircleRadius(feature);
    const circle = MapboxDrawGeodesic.createCircle(center, radius);
    draw?.deleteAll(); // single circle
    draw?.add(circle);
    map?.setCenter(circle.geometry.coordinates[0][0]);
    marker = new Marker({ color: '#FF0000' }).setLngLat(center).addTo(map);
  } else {
    draw?.add(feature);
    if (feature.geometry.type === 'Point') {
      marker = new Marker({ color: '#FF0000' })
        .setLngLat(feature.geometry.coordinates as [number, number])
        .addTo(map);
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  applyMode();
  if (marker) {
    marker.remove();
    marker = undefined;
  }
}

function drawTrash() {
  draw?.trash();
  updateArea();
}
</script>

<style scoped>
.mapinput {
  height: var(--t-height);
}
</style>
