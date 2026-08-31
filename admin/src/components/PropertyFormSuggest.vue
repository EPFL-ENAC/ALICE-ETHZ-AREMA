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
          v-model="selected[`${property}_low`]"
          :label="t('low')"
          @update:model-value="onUpdate(`${property}_low`)"
        >
          <q-menu v-model="showLowSuggestions" no-parent-event no-focus auto-close>
            <q-list v-if="suggestions" style="min-width: 100px">
              <q-item
                clickable
                v-close-popup
                v-for="sugg in suggestions.options"
                :key="sugg"
                @click="selected[`${property}_low`] = sugg"
              >
                <q-item-section>{{ sugg }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-input>
      </div>
      <div class="col">
        <q-input
          :disable="disable"
          filled
          v-model="selected[property]"
          :label="t('std')"
          @update:model-value="onUpdate(property)"
        >
          <q-menu v-model="showStdSuggestions" no-parent-event no-focus auto-close>
            <q-list v-if="suggestions" style="min-width: 100px">
              <q-item
                clickable
                v-close-popup
                v-for="sugg in suggestions.options"
                :key="sugg"
                @click="selected[property] = sugg"
              >
                <q-item-section>{{ sugg }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-input>
      </div>
      <div class="col">
        <q-input
          :disable="disable"
          filled
          v-model="selected[`${property}_high`]"
          :label="t('high')"
          @update:model-value="onUpdate(`${property}_high`)"
        >
          <q-menu v-model="showHighSuggestions" no-parent-event no-focus auto-close>
            <q-list v-if="suggestions" style="min-width: 100px">
              <q-item
                clickable
                v-close-popup
                v-for="sugg in suggestions.options"
                :key="sugg"
                @click="selected[`${property}_high`] = sugg"
              >
                <q-item-section>{{ sugg }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-input>
      </div>
    </div>
    <div class="q-mb-md text-hint">
      {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Suggestions } from '@/components/models';

const taxonomyStore = useTaxonomyStore();

interface Props {
  modelValue: { [key: string]: string | number | null };
  property: string;
  suggestions?: Suggestions | undefined;
  disable?: boolean | undefined;
}

const props = defineProps<Props>();
const emits = defineEmits(['suggest']);

const { t } = useI18n();

const showLowSuggestions = ref(false);
const showStdSuggestions = ref(false);
const showHighSuggestions = ref(false);

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

const selected = ref(props.modelValue);

watch(
  () => props.suggestions,
  (val) => {
    if (val) {
      showLowSuggestions.value = val.key.endsWith('_low');
      showHighSuggestions.value = val.key.endsWith('_high');
      showStdSuggestions.value = !showLowSuggestions.value && !showHighSuggestions.value;
    } else {
      showLowSuggestions.value = false;
      showHighSuggestions.value = false;
      showStdSuggestions.value = false;
    }
  },
);

function onUpdate(key: string) {
  if (selected.value[key] === '') {
    selected.value[key] = null;
  }
  emits('suggest', props.property, key, selected.value[key]);
}

function getNode() {
  // lookup node for which id is property
  if (!physicsTaxo.value) return null;
  return taxonomyStore.findChildNodeById(physicsTaxo.value, props.property);
}
</script>
