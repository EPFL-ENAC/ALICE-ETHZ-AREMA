<script setup lang="ts">
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import 'maplibregl-theme-switcher/styles.css';
// import { geocoderApi } from '../utils/geocoder';
import { style, themes } from '../utils/maps';
import * as MapboxDrawGeodesic from 'mapbox-gl-draw-geodesic';
// import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder';
import { ThemeSwitcherControl } from 'maplibregl-theme-switcher';
import {
  type Feature,
  type MultiPolygon,
  type Polygon,
  type Point,
  center,
  circle,
  FeatureCollection,
  Units,
} from '@turf/turf';
import {
  FullscreenControl,
  GeolocateControl,
  Map,
  Marker,
  NavigationControl,
  ScaleControl,
  Popup,
} from 'maplibre-gl';
import { shallowRef, onMounted, markRaw, watch, unref } from 'vue';
const { t /*locale*/ } = useI18n({ useScope: 'global' });

const props = withDefaults(
  defineProps<{
    features: [
      Feature<Polygon | MultiPolygon>[] | Feature<Polygon | MultiPolygon>,
    ];
    centre?: [number, number];
    zoom?: number;
    aspectRatio?: number;
    minZoom?: number;
    maxZoom?: number;
    width?: string;
    height?: string;
  }>(),
  {
    centre: () => [8, 46.8],
    zoom: 4,
    aspectRatio: undefined,
    minZoom: undefined,
    maxZoom: undefined,
    width: '100%',
    height: '800px',
  },
);
const map = shallowRef<Map | undefined>(undefined);

const containerId = 'map-view-' + Math.random().toString(36).slice(2);

// track which were the layers and éarlers added, to be able to remove them
const layerIds: string[] = [];
const markers: Marker[] = [];

onMounted(() => {
  map.value = markRaw(
    new Map({
      container: containerId,
      center: [props.centre[0], props.centre[1]],
      style: style,
      trackResize: true,
      zoom: props.zoom,
    }),
  );
  map.value.addControl(new NavigationControl({}));
  map.value.addControl(new GeolocateControl({}));
  map.value.addControl(new ScaleControl({}));
  map.value.addControl(new FullscreenControl({}));
  // map.value.addControl(
  //   new MaplibreGeocoder(geocoderApi, {
  //     maplibregl: { Marker },
  //     showResultsWhileTyping: true,
  //     language: locale.value,
  //   }),
  //   'top-left'
  // );
  map.value.addControl(new ThemeSwitcherControl(themes, themes[0].id));

  map.value.on('load', function () {
    displayFeatures();
  });
});

watch(
  () => props.features,
  () => {
    displayFeatures();
  },
  { immediate: true, deep: true },
);

function displayFeatures() {
  const features = unref(props.features);
  if (map.value && layerIds.length > 0) {
    layerIds.forEach((layerId) => {
      map.value?.removeLayer(layerId);
      map.value?.removeSource(layerId);
    });
    layerIds.splice(0);
  }
  if (map.value && markers.length > 0) {
    markers.forEach((marker) => {
      marker.remove();
    });
    markers.splice(0);
  }
  if (features) {
    features
      .map((f) => unref(f))
      .forEach((feature) => {
        console.log(feature);
        if (feature.type === 'FeatureCollection') {
          displayPolygons(feature);
        } else if (MapboxDrawGeodesic.isCircle(feature)) {
          displayCircle(feature);
        } else if (feature.type === 'Feature') {
          displayPoint(feature);
        }
      });
  }
}

function displayCircle(feature: Feature<Polygon>) {
  if (map.value) {
    // a circle is not a geojson type, then prevent changes in representation using the geodesic API
    const center = MapboxDrawGeodesic.getCircleCenter(feature);
    const radius = MapboxDrawGeodesic.getCircleRadius(feature);
    const popup = new Popup({
      closeButton: false,
      offset: 25,
    }).setHTML(`
      <div class="text-h6">${feature.properties.name}</div>
      <p>${feature.properties.description}</p>
      <p><b>${t('address')}</b>: ${feature.properties.address}</p>
      <p><b>${t('radius')}</b>: ${radius}km</p>`);
    markers.push(
      new Marker({ color: '#FF0000' })
        .setLngLat(center)
        .setPopup(popup)
        .addTo(map.value),
    );

    // Generate a polygon using turf.circle.
    // See https://turfjs.org/docs/#circle
    const options = {
      steps: 64,
      units: 'kilometers' as Units,
    };
    const cc = circle(center, radius, options);

    // Add a fill layer with some transparency.
    const color = randomColor();
    layerIds.push(`${feature.id}`);
    map.value.addLayer({
      id: `${feature.id}`,
      type: 'fill',
      source: {
        type: 'geojson',
        data: cc,
      },
      paint: {
        'fill-color': color,
        'fill-opacity': 0.2,
      },
    });
  }
}

function displayPoint(feature: Feature<Point>) {
  if (map.value) {
    // a circle is not a geojson type, then prevent changes in representation using the geodesic API
    const center = feature.geometry.coordinates;
    const popup = new Popup({
      closeButton: false,
      offset: 25,
    }).setHTML(`
      <div class="text-h6">${feature.properties.name}</div>
      <p>${feature.properties.description}</p>
      <p><b>${t('address')}</b>: ${feature.properties.address}</p>`);
    markers.push(
      new Marker({ color: '#FF0000' })
        .setLngLat(center)
        .setPopup(popup)
        .addTo(map.value),
    );
  }
}

function displayPolygons(featureCollection: Feature<FeatureCollection>) {
  const ct = center(featureCollection);
  const popup = new Popup({
    closeButton: false,
    offset: 25,
  }).setHTML(`<b>Zones</b>: ${featureCollection.features.length}`);
  markers.push(
    new Marker({ color: '#FF0000' })
      .setLngLat(ct.geometry.coordinates)
      .setPopup(popup)
      .addTo(map.value),
  );

  const color = randomColor();
  layerIds.push(`${feature.id}`);
  featureCollection.features.forEach((feature) => {
    // Add a fill layer with some transparency.
    map.value?.addLayer({
      id: `${feature.id}`,
      type: 'fill',
      source: {
        type: 'geojson',
        data: feature,
      },
      paint: {
        'fill-color': color,
        'fill-opacity': 0.2,
      },
    });
  });
}

function randomColor() {
  return `#${(0x1000000 + Math.random() * 0xffffff)
    .toString(16)
    .substring(1, 7)}`;
}
</script>

<template>
  <div>
    <div
      :id="containerId"
      :style="`--t-width: ${width}; --t-height: ${height}`"
      class="mapview"
    />
  </div>
</template>

<style scoped>
.mapview {
  width: var(--t-width);
  height: var(--t-height);
}
</style>
