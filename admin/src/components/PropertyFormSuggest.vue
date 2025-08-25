<template>
  <div>
    <div class="q-mb-sm">
      {{ t(property) }}
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
      {{ t(`${property}_hint`) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Suggestions } from 'src/components/models';

interface Props {
  modelValue: { [key: string]: string | number | null };
  property: string;
  suggestions?: Suggestions;
  disable?: boolean | undefined;
}

const props = defineProps<Props>();
const emits = defineEmits(['suggest']);

const { t } = useI18n();

const showLowSuggestions = ref(false);
const showStdSuggestions = ref(false);
const showHighSuggestions = ref(false);

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
</script>
