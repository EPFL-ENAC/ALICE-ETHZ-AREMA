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
      {{ t(`${property}_hint`) }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: { [key: string]: string | number | null };
  property: string;
  disable?: boolean | undefined;
}

const props = defineProps<Props>();

const { t } = useI18n();

const selected = ref(props.modelValue);

// https://github.com/quasarframework/quasar/issues/17359
function onUpdate(key: string) {
  if (selected.value[key] === '') {
    selected.value[key] = null;
  }
}
</script>
