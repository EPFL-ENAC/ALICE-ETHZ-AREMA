<template>
  <q-select
    :model-value="model"
    :options="filtered"
    use-input
    hide-selected
    fill-input
    input-debounce="0"
    hide-dropdown-icon
    @filter="onFilter"
    @input-value="(val: string) => (model = val)"
  />
</template>

<script setup lang="ts">
import { fetchAffiliations } from '@/utils/affiliations';

const model = defineModel<string | undefined>();

const affiliations = ref<string[]>([]);
const filtered = ref<string[]>([]);

onMounted(() => {
  // suggestions are a convenience: on failure the field still accepts free text
  fetchAffiliations()
    .then((res) => (affiliations.value = res))
    .catch(() => undefined);
});

function onFilter(val: string, update: (fn: () => void) => void) {
  update(() => {
    const needle = val.toLowerCase();
    filtered.value = affiliations.value.filter((a) => a.toLowerCase().includes(needle));
  });
}
</script>
