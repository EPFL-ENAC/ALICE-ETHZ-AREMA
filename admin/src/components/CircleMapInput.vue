<template>
  <div>
    <div class="row q-col-gutter-md q-mb-sm">
      <div>
        <q-btn color="primary" @click="edit()" icon="edit" size="sm" />
        <q-btn flat class="q-ml-sm" color="red" :disable="modelValue === null" @click="deleteAll()" icon="delete" />
      </div>
      <q-input
        filled
        dense
        hide-bottom-space
        :label="$t('radius')"
        type="number"
        :rules="rules"
        :disable="modelValue === null"
        v-model.number="radius"
        @change="onRadiusUpdate"
        style="width: 150px"
        class="q-mb-sm"
      />
      <address-input
        v-model="address"
        :hint="$t('address_input_hint')"
        @feature="updateWithLocation"
        @update:model-value="onAddressUpdate"
        style="width: 400px"
      />
    </div>

    <div class="row">
      <div class="col-12">
        <map-input
          ref="mapInput"
          :center="center"
          :zoom="zoom"
          :height="height"
          @update:selected-features="onFeatureSelected($event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { round } from 'lodash';
import MapInput from 'src/components/MapInput.vue';
import AddressInput from 'src/components/AddressInput.vue';
import * as MapboxDrawGeodesic from 'mapbox-gl-draw-geodesic';
import { geocoderApi, toAddress } from 'src/utils/geocoder';
import { type Feature, type MultiPolygon, type Polygon } from '@turf/turf';

interface Props {
  modelValue: Feature<Polygon | MultiPolygon> | null;
  center: [number, number];
  zoom: number;
  height: string;
}

const props = withDefaults(defineProps<Props>(), {
  center: () => [6.62887615, 46.5325242],
  zoom: 8,
  height: '400px',
});
const emit = defineEmits(['update:modelValue']);

const address = ref<string>();
const search = ref<string>();
const suggestions = ref<string[]>([]);

const mapInput = ref<InstanceType<typeof MapInput>>();
const radius = ref<number>(10);
const minRadius = 1;
const maxRadius = 1000;
const rules = [
  (v: number) => (v && v >= minRadius) || t('minRadiusValid', { n: minRadius }),
  (v: number) => (v && v <= maxRadius) || t('maxRadiusValid', { n: maxRadius }),
];
const { t } = useI18n();

onMounted(() => {
  const feature = props.modelValue ? JSON.parse(JSON.stringify(props.modelValue)) : null;
  //console.log('feature', feature);
  if (feature && feature.properties) {
    address.value = feature.properties.addressInput;
    radius.value = feature.properties.circleRadius;
    mapInput.value?.drawFeature(feature);
  }
});

function onFeatureSelected(selectedFeatures: Feature<Polygon | MultiPolygon>[]) {
  if (selectedFeatures && selectedFeatures.length > 0) {
    const value = selectedFeatures.pop();
    if (value && value.properties && value.geometry.coordinates.length > 0) {
      value.properties.circleRadius = round(value.properties.circleRadius, 0);
      radius.value = value.properties.circleRadius;
      const center = MapboxDrawGeodesic.getCircleCenter(unref(value));
      geocoderApi.reverseGeocode({ query: { lon: center[0], lat: center[1] } }).then((collection) => {
        address.value = undefined;
        if (collection && collection.features && collection.features.length) {
          const location = collection.features.pop();
          if (location) {
            address.value = toAddress(location);
            value.properties = {
              circleRadius: value.properties?.circleRadius,
              addressInput: address.value,
              ...location.properties,
            };
          }
        }
        emit('update:modelValue', value);
      });
    }
  } else {
    radius.value = 10;
    emit('update:modelValue', null);
  }
}

function onRadiusUpdate() {
  const feature = unref(props.modelValue);
  if (feature && feature.properties && feature.properties.circleRadius !== radius.value) {
    feature.properties.circleRadius = radius.value;
    feature.properties.addressInput = address.value;
    mapInput.value?.drawFeature(feature);
    emit('update:modelValue', feature);
  }
}

function onAddressUpdate() {
  const feature = unref(props.modelValue);
  if (feature && feature.properties && feature.properties.addressInput !== address.value) {
    feature.properties.circleRadius = radius.value;
    feature.properties.addressInput = address.value;
    mapInput.value?.drawFeature(feature);
    emit('update:modelValue', feature);
  }
}

function edit() {
  mapInput.value?.deleteAll();
  mapInput.value?.drawCircle();
  address.value = undefined;
}

function deleteAll() {
  mapInput.value?.deleteAll();
  address.value = undefined;
  search.value = undefined;
  suggestions.value = [];
}

function updateWithLocation(location: Feature) {
  let value = props.modelValue ? JSON.parse(JSON.stringify(props.modelValue)) : null;
  if (!value?.properties) {
    value = {
      type: 'Feature',
      properties: {
        circleRadius: radius.value,
      },
    };
  }
  value.properties = {
    circleRadius: value.properties.circleRadius,
    addressInput: address.value,
    ...location.properties,
  };
  value.geometry = {
    type: 'Polygon',
    coordinates: [[location.center, location.center, location.center, location.center]],
  };
  mapInput.value?.drawFeature(value);
  emit('update:modelValue', value);
}
</script>
