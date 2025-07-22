<template>
  <div>
    <div class="row">
      <address-input
        v-model="address"
        :hint="t('address_input_hint')"
        @feature="updateWithLocation"
        style="width: 400px"
      />
      <div class="q-ml-sm">
        <q-btn flat color="red" :disable="modelValue === null" @click="deleteAll()" icon="delete" />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div :id="mapId" :style="`--t-height: ${height || '400px'}`" class="mapinput" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AddressInput from 'src/components/AddressInput.vue';
import { geocoderApi, toAddress } from 'src/utils/geocoder';
import { style, themes } from '../utils/maps';
import type { Feature, MultiPolygon, Point, Polygon } from 'geojson';
import {
  AttributionControl,
  FullscreenControl,
  GeolocateControl,
  Map,
  Marker,
  NavigationControl,
  ScaleControl,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ThemeSwitcherControl } from 'maplibregl-theme-switcher';

interface Props {
  modelValue: Feature<Point> | null;
  center?: [number, number] | undefined;
  zoom?: number | undefined;
  height: string;
}

const props = withDefaults(defineProps<Props>(), {
  center: () => [6.62887615, 46.5325242],
  zoom: 8,
  height: '400px',
});

const emit = defineEmits(['update:modelValue']);

const { t } = useI18n();

const address = ref<string>();
const search = ref<string>();
const suggestions = ref<string[]>([]);

const mapId = 'map-input-' + Math.random().toString(36).slice(2);
let map: Map | undefined = undefined;
let marker: Marker | undefined = undefined;

onMounted(onInit);

function onInit() {
  map = new Map({
    container: mapId,
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

  const feature = unref(props.modelValue);
  if (feature && feature.properties) {
    address.value = feature.properties.addressInput;
    const coordinates = feature.geometry.coordinates as [number, number];
    marker = new Marker({ color: '#FF0000' }).setLngLat(coordinates).addTo(map);
    map.setCenter(coordinates);
  }
  map.on('click', (e) => {
    if (!map) {
      return;
    }
    if (marker) {
      marker.remove();
    }
    marker = new Marker({ color: '#FF0000' }).setLngLat([e.lngLat.lng, e.lngLat.lat]).addTo(map);
    const point = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [e.lngLat.lng, e.lngLat.lat],
      },
      properties: {
        addressInput: address.value,
      },
    } as Feature<Point>;
    onFeatureSelected(point);
  });
}

function onFeatureSelected(selectedFeature: Feature<Point>) {
  if (!selectedFeature) {
    emit('update:modelValue', null);
    if (marker) {
      marker.remove();
      marker = undefined;
    }
    return;
  }
  const value = selectedFeature;
  if (value && value.properties && value.geometry.coordinates.length > 0) {
    const center = value.geometry.coordinates;
    if (center.length !== 2) {
      console.error('Invalid coordinates for circle center:', center);
      return;
    }
    if (typeof center[0] !== 'number' || typeof center[1] !== 'number') {
      console.error('Invalid coordinates for circle center:', center);
      return;
    }
    void geocoderApi
      .reverseGeocode({ query: { lon: center[0], lat: center[1] } })
      .then((collection) => {
        if (collection && collection.features && collection.features.length) {
          const location = collection.features.pop();
          if (location) {
            address.value = toAddress(location);
            value.properties = {
              ...location?.properties,
              addressInput: address.value,
            };
          }
        }
        emit('update:modelValue', value);
      });
  }
}

function deleteAll() {
  address.value = undefined;
  search.value = undefined;
  suggestions.value = [];
  emit('update:modelValue', null);
  if (marker) {
    marker.remove();
    marker = undefined;
  }
}

function updateWithLocation(location: Feature<Point | Polygon | MultiPolygon>) {
  location.properties = {
    ...location.properties,
    addressInput: address.value,
  };
  if (map && location.geometry.type === 'Point') {
    const coordinates = location.geometry.coordinates as [number, number];
    map.setCenter(coordinates);
    if (marker) {
      marker.remove();
    }
    marker = new Marker({ color: '#FF0000' }).setLngLat(coordinates).addTo(map);
  }
  emit('update:modelValue', location);
}
</script>

<style scoped>
.mapinput {
  height: var(--t-height);
}
</style>
