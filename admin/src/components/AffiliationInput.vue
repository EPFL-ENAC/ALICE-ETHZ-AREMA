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
import type { SubjectProfile } from '@/models';

const model = defineModel<string | undefined>();

const services = useServices();

const affiliations = ref<string[]>([]);
const filtered = ref<string[]>([]);

onMounted(() => {
  // suggestions are a convenience: on failure the field still accepts free text
  void services
    .make('subject-profile')
    .find({ $skip: 0, $limit: 1000 })
    .then((response) => {
      affiliations.value = [
        ...new Set(
          (response.data as SubjectProfile[])
            .map((p) => p.affiliation?.trim())
            .filter((a): a is string => !!a),
        ),
      ].sort((a, b) => a.localeCompare(b));
    })
    .catch(() => undefined);
});

function onFilter(val: string, update: (fn: () => void) => void) {
  update(() => {
    const needle = val.toLowerCase();
    filtered.value = affiliations.value.filter((a) => a.toLowerCase().includes(needle));
  });
}
</script>
