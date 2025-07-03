<template>
  <div>
    <div class="row">
      <div>
        <q-btn color="primary" @click="edit()" icon="edit" size="sm" />
        <q-btn
          flat
          class="q-ml-sm"
          color="red"
          :disable="modelValue === null"
          @click="deleteAll()"
          icon="delete"
        />
      </div>
      <address-input
        v-model="address"
        :hint="t('address_input_hint')"
        @feature="updateWithLocation"
        @update:model-value="onAddressUpdate"
        style="width: 400px"
      />
    </div>

    <div class="row">
      <div class="col-12">
        <map-input
          :feature="modelValue"
          :mode="mode"
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
import { geocoderApi, toAddress } from 'src/utils/geocoder';
import type { Feature, MultiPolygon, Point, Polygon } from 'geojson';

interface Props {
  modelValue: Feature<Polygon | MultiPolygon> | null;
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
const mode = ref<string | undefined | null>();

onMounted(() => {
  const feature = unref(props.modelValue);
  if (feature && feature.properties) {
    address.value = feature.properties.addressInput;
    mode.value = 'draw_point';
  }
});

function onFeatureSelected(selectedFeatures: Feature<Polygon | MultiPolygon>[]) {
  if (selectedFeatures && selectedFeatures.length > 0) {
    const value = selectedFeatures.pop();
    if (value && value.properties && value.geometry.coordinates.length > 0) {
      value.properties.circleRadius = round(value.properties.circleRadius, 0);
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
  } else {
    emit('update:modelValue', null);
  }
}

function edit() {
  mode.value = 'draw_point';
  address.value = undefined;
}

function deleteAll() {
  mode.value = undefined;
  address.value = undefined;
  search.value = undefined;
  suggestions.value = [];
}

function updateWithLocation(location: Feature<Point | Polygon | MultiPolygon>) {
  location.properties = {
    ...location.properties,
    addressInput: address.value,
  };
  emit('update:modelValue', location);
}

function onAddressUpdate() {
  const feature = unref(props.modelValue);
  if (feature && feature.properties?.addressInput !== address.value) {
    feature.properties = {
      ...feature.properties,
      addressInput: address.value,
    };
    emit('update:modelValue', feature);
  }
}
</script>
