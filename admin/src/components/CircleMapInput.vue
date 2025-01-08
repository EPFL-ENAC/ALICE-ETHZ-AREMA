<script lang="ts">
import { useI18n } from 'vue-i18n';
import { round } from 'lodash';
import MapInput from './MapInput.vue';
import * as MapboxDrawGeodesic from 'mapbox-gl-draw-geodesic';
import { geocoderApi } from '../utils/geocoder';
import { type Feature, type MultiPolygon, type Polygon } from '@turf/turf';
import { defineComponent, ref, onMounted, unref } from 'vue';

export default defineComponent({
  name: 'CircleMapInput',
  props: {
    modelValue: {
      type: Object,
      default: null,
    },
    center: {
      type: Array,
      default: () => [6.62887615, 46.5325242],
    },
    zoom: {
      type: Number,
      default: 8,
    },
    height: {
      type: String,
      default: '400px',
    },
  },
  emits: ['update:modelValue'],
  components: {
    MapInput,
  },
  setup(props, { emit }) {
    const address = ref<string>();
    const search = ref<string>();
    const suggestedFeatures = ref<Feature[]>([]);
    const suggestions = ref<string[]>([]);

    const mapInput = ref<InstanceType<typeof MapInput>>();
    const radius = ref<number>(10);
    const minRadius = 1;
    const maxRadius = 1000;
    const rules = [
      (v) => (v && v >= minRadius) || t('minRadiusValid', { n: minRadius }),
      (v) => (v && v <= maxRadius) || t('maxRadiusValid', { n: maxRadius }),
    ];
    const { t } = useI18n();

    onMounted(() => {
      const feature = unref(props.modelValue);
      if (feature && feature.properties) {
        address.value = feature.properties.display_name;
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
            if (collection && collection.features && collection.features.length) {
              const location = collection.features.pop();
              value.properties = {
                circleRadius: value.properties?.circleRadius,
                ...location.properties,
              };
            }
            address.value = value.properties?.display_name;
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
      if (feature && feature.properties.circleRadius !== radius.value) {
        feature.properties.circleRadius = radius.value;
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
      let value = unref(props.modelValue);
      if (!value)
        value = {
          type: 'Feature',
          properties: {
            circleRadius: radius.value,
          },
        };
      value.properties = {
        circleRadius: value.properties.circleRadius,
        ...location.properties,
      };
      value.geometry = {
        type: 'Polygon',
        coordinates: [[location.center, location.center, location.center, location.center]],
      };
      mapInput.value?.drawFeature(value);
      emit('update:modelValue', value);
    }

    function lookupAddress(val, update) {
      update(() => {
        if (val && val.length > 2) {
          geocoderApi.forwardGeocode({ query: val, limit: 5 }).then((collection) => {
            if (collection && collection.features && collection.features.length) {
              suggestedFeatures.value = collection.features;
              suggestions.value = collection.features.map((feature) => feature.properties.display_name);
            }
          });
        } else {
          suggestedFeatures.value = [];
          suggestions.value = [];
        }
      });
    }

    function onAddressUpdate() {
      const location = suggestedFeatures.value.find((feature) => feature.properties?.text === address.value);
      if (location) updateWithLocation(location);
    }

    return {
      props,
      emit,
      address,
      search,
      suggestedFeatures,
      suggestions,
      mapInput,
      radius,
      minRadius,
      maxRadius,
      rules,
      t,
      onFeatureSelected,
      onRadiusUpdate,
      edit,
      deleteAll,
      updateWithLocation,
      lookupAddress,
      onAddressUpdate,
    };
  },
});
</script>

<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div>
          <q-btn color="primary" @click="edit()" icon="edit" size="sm" />
          <q-btn flat class="q-ml-sm" color="red" :disable="modelValue === null" @click="deleteAll()" icon="delete" />
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
            style="max-width: 100px"
            class="float-right q-mb-sm"
          />
          <q-select
            filled
            dense
            v-model="address"
            use-input
            clearable
            input-debounce="200"
            :label="$t('address') + ' *'"
            :options="suggestions"
            @filter="lookupAddress"
            @change="onAddressUpdate"
            @clear="deleteAll"
            class="float-right q-mb-sm on-left"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ $t('no_results') }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </div>
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
