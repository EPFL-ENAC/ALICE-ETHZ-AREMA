<template>
  <div
    id="map-results"
    :style="`--t-width: ${width}; --t-height: ${height}`"
    class="mapview"
  />
</template>

<script setup lang="ts">
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import 'maplibregl-theme-switcher/styles.css';
import { style } from '../utils/maps';
import { type Feature, type Point, FeatureCollection } from '@turf/turf';
import {
  FullscreenControl,
  GeolocateControl,
  Map,
  Marker,
  NavigationControl,
  ScaleControl,
  Popup,
} from 'maplibre-gl';

const { t } = useI18n({ useScope: 'global' });

interface Props {
  features?: FeatureCollection;
  centre?: [number, number];
  zoom?: number;
  aspectRatio?: number;
  minZoom?: number;
  maxZoom?: number;
  width?: string;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  centre: () => [8, 46.8],
  zoom: 6,
  aspectRatio: undefined,
  minZoom: undefined,
  maxZoom: undefined,
  width: '100%',
  height: '800px',
});

let map = shallowRef<Map>();

// track which were the layers and éarlers added, to be able to remove them
const layerIds: string[] = [];
const markers: Marker[] = [];

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  if (map.value) {
    map.value.remove();
    map.value = undefined;
  }
});

function initMap() {
  if (map.value) {
    return;
  }
  map.value = new Map({
    container: 'map-results',
    center: [props.centre[0], props.centre[1]],
    style: style,
    trackResize: true,
    zoom: props.zoom,
  });
  map.value.addControl(new NavigationControl({}));
  map.value.addControl(new GeolocateControl({}));
  map.value.addControl(new ScaleControl({}));
  map.value.addControl(new FullscreenControl({}));

  map.value.on('load', function () {
    displayFeatures();
  });
}

watch(
  () => props.features,
  () => {
    displayFeatures();
  },
  { immediate: true, deep: true },
);

function displayFeatures() {
  const features = props.features?.features;
  if (map.value && layerIds.length > 0) {
    layerIds.forEach((layerId) => {
      map.value?.removeLayer(layerId);
      map.value?.removeSource(layerId);
    });
    if (layerIds.length) layerIds.splice(0);
  }
  if (map.value && markers.length > 0) {
    markers.forEach((marker) => {
      marker.remove();
    });
    markers.splice(0);
  }
  if (features) {
    features.forEach((feature) => {
      if (feature.geometry.type === 'Point') {
        displayPoint(feature as Feature<Point>);
      }
    });
  }
}

function displayPoint(feature: Feature<Point>) {
  if (map.value) {
    const center = feature.geometry.coordinates as [number, number];
    const popup = new Popup({
      closeButton: false,
      offset: 25,
    }).setHTML(`
      <div class="text-primary">${t(feature.properties?.entity_type)}</div>
      <div class="text-h6">${feature.properties?.name}</div>
      <div>${feature.properties?.description ? feature.properties?.description : ''}</div>`);
    markers.push(
      new Marker({ color: '#FF0000' })
        .setLngLat(center)
        .setPopup(popup)
        .addTo(map.value),
    );
  }
}
</script>

<style scoped>
.mapview {
  width: var(--t-width);
  height: var(--t-height);
}
</style>
