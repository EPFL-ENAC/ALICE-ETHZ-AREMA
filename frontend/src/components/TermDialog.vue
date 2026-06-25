<template>
  <q-dialog v-model="showDialog" @hide="onHide">
    <q-card class="dialog-sm">
      <q-card-actions>
        <div v-if="label" class="text-h6 q-ml-sm">&laquo;{{ label }}&raquo;</div>
        <div v-else class="text-h6 q-ml-sm">{{ getLocaleProp('names') }}</div>
        <q-space />
        <q-btn flat icon="close" color="primary" v-close-popup />
      </q-card-actions>
      <q-separator />
      <q-card-section class="q-pt-none">
        <div v-if="label" class="text-bold q-mt-md">{{ getLocaleProp('names') }}</div>
        <q-markdown :src="getLocaleProp('descriptions')" no-heading-anchor-links class="q-mt-md" />
        <div v-if="hasAttributes" class="text-caption q-mb-md">
          <q-list dense>
            <template v-for="(value, key) in attributes" :key="key">
              <q-item class="q-pa-none">
                <q-item-section>
                  <q-item-label>{{ t(key) }}</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-item-label caption>{{ value }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator color="primary" />
            </template>
          </q-list>
        </div>
        <!-- <div class="text-caption text-secondary">{{ urn }}</div> -->
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { Term } from 'src/components/models';
import type { TaxonomyNode } from 'src/models';

const { t, locale } = useI18n();
const taxonomyStore = useTaxonomyStore();

interface DialogProps {
  modelValue: boolean;
  term: Term | undefined | null;
}

const props = defineProps<DialogProps>();
const emit = defineEmits(['update:modelValue']);

const showDialog = ref(props.modelValue);
const termNode = ref<TaxonomyNode | undefined>();
const label = computed(() => props.term?.label || '');
// const urn = computed(() => props.term?.urn || '');
const attributes = computed(() => {
  if (!termNode.value) return {};
  return termNode.value.attributes || {};
});
const hasAttributes = computed(() => {
  if (!termNode.value) return false;
  return !!termNode.value.attributes;
});

watch(
  () => props.modelValue,
  (value) => {
    showDialog.value = value;
    if (value && props.term) {
      termNode.value = taxonomyStore.getNode(props.term.urn);
      if (!termNode.value) {
        console.warn(`Term with URN ${props.term.urn} not found in taxonomy store.`);
      }
    }
  },
);

function onHide() {
  showDialog.value = false;
  emit('update:modelValue', false);
}

function getLocaleProp(prop: string) {
  if (!termNode.value) return '';
  const value = termNode.value[prop as keyof TaxonomyNode];
  if (typeof value === 'string') return value;
  if (
    typeof value === 'object' &&
    value !== null &&
    (value as Record<string, string>)[locale.value]
  )
    return (value as Record<string, string>)[locale.value];
  return '';
}
</script>
