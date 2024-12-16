<script lang="ts">
import { useI18n } from 'vue-i18n';
import { round } from 'lodash';
import MapInput from './MapInput.vue';
import { geocoderApi } from '../utils/geocoder';
import { type Feature, type MultiPolygon, type Polygon } from '@turf/turf';
import { defineComponent, ref, onMounted, unref } from 'vue';

export default defineComponent({
  name: 'PointMapInput',
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
    const { t } = useI18n();

    onMounted(() => {
      const feature = unref(props.modelValue);
      if (feature && feature.properties) {
        address.value = feature.properties.display_name;
        mapInput.value?.drawFeature(feature);
      }
    });

    function onFeatureSelected(
      selectedFeatures: Feature<Polygon | MultiPolygon>[],
    ) {
      if (selectedFeatures && selectedFeatures.length > 0) {
        const value = selectedFeatures.pop();
        if (
          value &&
          value.properties &&
          value.geometry.coordinates.length > 0
        ) {
          value.properties.circleRadius = round(
            value.properties.circleRadius,
            0,
          );
          const center = value.geometry.coordinates;
          geocoderApi
            .reverseGeocode({ query: { lon: center[0], lat: center[1] } })
            .then((collection) => {
              if (
                collection &&
                collection.features &&
                collection.features.length
              ) {
                const location = collection.features.pop();
                value.properties = {
                  ...location?.properties,
                };
              }
              address.value = value.properties?.display_name;
              emit('update:modelValue', value);
            });
        }
      } else {
        emit('update:modelValue', null);
      }
    }

    function edit() {
      mapInput.value?.deleteAll();
      mapInput.value?.drawPoint();
      address.value = undefined;
    }

    function deleteAll() {
      mapInput.value?.deleteAll();
      address.value = undefined;
      search.value = undefined;
      suggestions.value = [];
    }

    function updateWithLocation(location: Feature) {
      mapInput.value?.drawFeature(location);
      emit('update:modelValue', location);
    }

    function lookupAddress(val, update) {
      update(() => {
        if (val && val.length > 2) {
          geocoderApi
            .forwardGeocode({ query: val, limit: 5 })
            .then((collection) => {
              if (
                collection &&
                collection.features &&
                collection.features.length
              ) {
                suggestedFeatures.value = collection.features;
                suggestions.value = collection.features.map(
                  (feature) => feature.properties.display_name,
                );
              }
            });
        } else {
          suggestedFeatures.value = [];
          suggestions.value = [];
        }
      });
    }

    function onAddressUpdate() {
      const location = suggestedFeatures.value.find(
        (feature) => feature.properties?.text === address.value,
      );
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
      t,
      onFeatureSelected,
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
          <q-btn
            flat
            class="q-ml-sm"
            color="red"
            :disable="modelValue === null"
            @click="deleteAll()"
            icon="delete"
          />
          <q-select
            filled
            dense
            v-model="address"
            use-input
            clearable
            input-debounce="200"
            :label="$t('address') + '*'"
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
