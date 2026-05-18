<template>
  <div>
    <div class="q-mb-sm">
      {{ name }}
    </div>
    <div class="row q-col-gutter-sm q-mb-sm">
      <div class="col">
        <q-input
          :disable="disable"
          filled
          v-model.number="selected[`${property}_low`]"
          type="number"
          :label="t('low')"
          @update:model-value="onUpdate(`${property}_low`)"
        />
      </div>
      <div class="col">
        <q-input
          :disable="disable"
          filled
          v-model.number="selected[property]"
          type="number"
          :label="t('std')"
          @update:model-value="onUpdate(property)"
        />
      </div>
      <div class="col">
        <q-input
          :disable="disable"
          filled
          v-model.number="selected[`${property}_high`]"
          type="number"
          :label="t('high')"
          @update:model-value="onUpdate(`${property}_high`)"
        />
      </div>
    </div>
    <div class="q-mb-md text-hint">
      {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
const taxonomyStore = useTaxonomyStore();

interface Props {
  modelValue: { [key: string]: string | number | null };
  property: string;
  disable?: boolean | undefined;
}

const props = defineProps<Props>();

const { t } = useI18n();

const selected = ref(props.modelValue);

const physicsTaxo = computed(() => {
  return taxonomyStore.getTaxonomy('physical-characteristics');
});

const name = computed(() => {
  const found = getNode();
  if (!found) return t(props.property);
  return taxonomyStore.getLabel(found.names);
});

const hint = computed(() => {
  // lookup node for which id is property
  const found = getNode();
  if (!found) return '';
  const description = taxonomyStore.getLabel(found.descriptions);
  const symbolUnit: string[] = [];
  const symbol = found?.attributes?.['symbol'];
  if (symbol) symbolUnit.push(symbol);
  const unit = found?.attributes?.['unit'];
  if (unit) symbolUnit.push(unit);
  return symbolUnit.length ? `${description} [${symbolUnit.join(', ')}]` : description;
});

// https://github.com/quasarframework/quasar/issues/17359
function onUpdate(key: string) {
  if (selected.value[key] === '') {
    selected.value[key] = null;
  }
}

function getNode() {
  // lookup node for which id is property
  if (!physicsTaxo.value) return null;
  return taxonomyStore.findChildNodeById(physicsTaxo.value, props.property);
}
</script>
