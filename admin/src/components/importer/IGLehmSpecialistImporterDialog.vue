<template>
  <q-dialog v-model="showDialog" persistent @hide="onHide">
    <q-card class="dialog-md">
      <q-card-section>
        <div class="text-h6">{{ t('importer.iglehm.specialist_import.title') }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-hint">{{ t('importer.iglehm.specialist_import.hint') }}</div>
        <IGLehmSpecialistsPanel @update:modelValue="onSpecialistSelected" />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="bg-grey-3">
        <q-btn flat :label="t('cancel')" color="secondary" @click="onCancel" v-close-popup />
        <q-btn
          flat
          :label="t('import')"
          color="primary"
          :disable="!specialist"
          @click="onImport"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import IGLehmSpecialistsPanel from 'src/components/importer/IGLehmSpecialistsPanel.vue';
import { type IGLehmSpecialistSummary } from 'src/models';

const { t } = useI18n();

interface DialogProps {
  modelValue: boolean;
}

const props = defineProps<DialogProps>();
const emit = defineEmits(['update:modelValue', 'import', 'cancel']);

const showDialog = ref(props.modelValue);
const specialist = ref<IGLehmSpecialistSummary | null>(null);

watch(
  () => props.modelValue,
  (value) => {
    showDialog.value = value;
    if (value) {
      specialist.value = null;
    }
  },
);

function onHide() {
  emit('update:modelValue', false);
}

function onCancel() {
  emit('cancel', true);
}

function onImport() {
  emit('import', specialist.value);
}

function onSpecialistSelected(selection: IGLehmSpecialistSummary | null) {
  specialist.value = selection;
}
</script>
