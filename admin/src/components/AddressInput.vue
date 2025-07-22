<template>
  <q-input
    filled
    dense
    v-model="address"
    :label="t('address')"
    :hint="hint"
    debounce="300"
    @keyup.enter="onSuggestAddress"
    @update:model-value="onUpdate"
    :loading="loading"
  >
    <q-menu v-model="showSuggestions" no-parent-event no-focus auto-close>
      <q-list style="min-width: 100px">
        <q-item
          clickable
          v-close-popup
          v-for="sugg in suggestions"
          :key="sugg.value"
          @click="onSuggestionSelected(sugg)"
        >
          <q-item-section>{{ sugg.value }}</q-item-section>
        </q-item>
        <q-item v-if="suggestions.length === 0">
          <q-item-section class="text-grey">
            {{ t('no_results') }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-input>
</template>

<script setup lang="ts">
import { geocoderApi, toAddress } from 'src/utils/geocoder';
import type { Feature } from '@turf/turf';

interface Props {
  modelValue: string | undefined;
  hint?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'feature']);

interface Suggestion {
  value: string;
  feature: Feature;
}

const { t } = useI18n();

const address = ref(props.modelValue);
const suggestions = ref<Suggestion[]>([]);
const showSuggestions = ref(false);
const loading = ref(false);

watch(
  () => props.modelValue,
  (val) => {
    address.value = val;
    suggestions.value = [];
  },
);

function onUpdate() {
  emit('update:modelValue', address.value);
}

function onSuggestAddress() {
  if (address.value === undefined || address.value.length < 3) {
    return;
  }
  loading.value = true;
  showSuggestions.value = false;
  void geocoderApi
    .forwardGeocode({ query: address.value, limit: 5, countries: [] })
    .then((collection) => {
      if (collection && collection.features && collection.features.length) {
        suggestions.value = collection.features
          .filter((feature) => feature.properties?.address)
          .map((feature) => ({ value: toAddress(feature), feature }));
      }
    })
    .finally(() => {
      showSuggestions.value = true;
      loading.value = false;
    });
}

function onSuggestionSelected(suggestion: Suggestion) {
  address.value = suggestion.value;
  showSuggestions.value = false;
  emit('feature', suggestion.feature);
  onUpdate();
}
</script>
