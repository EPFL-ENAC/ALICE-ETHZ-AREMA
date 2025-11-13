<template>
  <div>
    <div class="row q-mb-sm">
      <address-input
        :disable="disable"
        v-model="address"
        :hint="t('address_input_hint')"
        @feature="updateWithLocation"
        @update:model-value="onAddressUpdate"
        style="width: 400px"
      />
      <q-input
        filled
        dense
        hide-bottom-space
        :label="t('radius')"
        type="number"
        :rules="rules"
        :disable="disable || modelValue === null"
        v-model.number="radius"
        @update:model-value="onRadiusUpdate"
        style="width: 150px"
        class="q-mb-sm q-ml-sm"
      />
      <div>
        <q-btn
          v-show="disable !== true"
          flat
          class="q-ml-sm"
          color="red"
          :disable="modelValue === null"
          @click="deleteAll()"
          icon="delete"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <map-input
          :feature="modelValue"
          mode="draw_circle"
          :center="center"
          :zoom="zoom"
          :height="height"
          :disable="disable"
          @update:selectedFeatures="onFeatureSelected"
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
import type { Feature, MultiPolygon, Polygon } from 'geojson';

interface Props {
  modelValue: Feature<Polygon | MultiPolygon> | null;
  center?: [number, number] | undefined;
  zoom?: number | undefined;
  height: string;
  disable?: boolean | undefined;
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

const radius = ref<number>(10);
const minRadius = 1;
const maxRadius = 1000;
const rules = [
  (v: number) => (v && v >= minRadius) || t('minRadiusValid', { n: minRadius }),
  (v: number) => (v && v <= maxRadius) || t('maxRadiusValid', { n: maxRadius }),
];

onMounted(() => {
  const feature = toFeature();
  //console.log('feature', feature);
  if (feature && feature.properties) {
    address.value = feature.properties.addressInput;
    radius.value = feature.properties.circleRadius;
  }
});

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      const feature = toFeature();
      if (feature && feature.properties) {
        address.value = feature.properties.addressInput;
        radius.value = feature.properties.circleRadius;
      }
    } else {
      address.value = undefined;
      radius.value = 10;
    }
  },
);

function onFeatureSelected(selectedFeatures: Feature<Polygon | MultiPolygon>[]) {
  if (selectedFeatures && selectedFeatures.length > 0) {
    const value = selectedFeatures.pop();
    if (value && value.properties && value.geometry.coordinates.length > 0) {
      value.properties.circleRadius = round(value.properties.circleRadius, 0);
      radius.value = value.properties.circleRadius;
      const center = MapboxDrawGeodesic.getCircleCenter(unref(value));
      void geocoderApi
        .reverseGeocode({ query: { lon: center[0], lat: center[1] } })
        .then((collection) => {
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
  const feature = toFeature();
  if (feature && feature.properties && feature.properties.circleRadius !== radius.value) {
    feature.properties.circleRadius = radius.value;
    feature.properties.addressInput = address.value;
    emit('update:modelValue', feature);
  }
}

// function onAddressUpdate() {
//   const feature = toFeature();
//   if (feature && feature.properties && feature.properties.addressInput !== address.value) {
//     feature.properties.circleRadius = radius.value;
//     feature.properties.addressInput = address.value;
//     emit('update:modelValue', feature);
//   }
// }

function deleteAll() {
  address.value = undefined;
  search.value = undefined;
  suggestions.value = [];
  emit('update:modelValue', null);
}

function updateWithLocation(location: Feature) {
  let value = toFeature();
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
    ...location.properties,
    addressInput: address.value,
  };
  const center =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    location.geometry.type === 'Point' ? location.geometry.coordinates : (location as any).center;
  value.geometry = {
    type: 'Polygon',
    coordinates: [[center, center, center, center]],
  };
  emit('update:modelValue', value);
}

function onAddressUpdate(newAddress: string) {
  address.value = newAddress;
  updateWithLocation(unref(props.modelValue) as Feature<Polygon | MultiPolygon>);
}

function toFeature() {
  if (!props.modelValue) {
    return null;
  }
  const feature = unref(props.modelValue);
  return JSON.parse(JSON.stringify(feature));
}
</script>
