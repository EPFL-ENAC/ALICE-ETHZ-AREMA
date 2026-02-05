<template>
  <q-dialog v-model="showDialog" persistent @hide="onHide">
    <q-card class="dialog-sm">
      <q-card-actions>
        <div class="text-h6 q-ml-sm">{{ t(editMode ? 'edit' : 'add') }}</div>
        <q-space />
        <q-btn flat icon="close" color="primary" v-close-popup />
      </q-card-actions>
      <q-separator />

      <q-card-section>
        <q-form ref="form">
          <div class="q-mb-lg">
            <q-input
              filled
              v-model="selected.identifier"
              :label="t('profile.identifier') + ' *'"
              lazy-rules
              :rules="[(val) => !!val || t('field_required')]"
            />
            <q-input
              filled
              v-model="selected.type"
              :label="t('profile.type') + ' *'"
              lazy-rules
              :rules="[(val) => !!val || t('field_required')]"
            />
            <q-input
              filled
              v-model="selected.name"
              :label="t('profile.name') + ' *'"
              lazy-rules
              :rules="[(val) => !!val || t('field_required')]"
            />
            <q-input
              filled
              v-model="selected.affiliation"
              :label="t('profile.affiliation')"
              class="q-mb-md"
            />
            <q-input
              filled
              v-model="selected.email"
              :label="t('profile.email')"
              :hint="t('profile.email_hint')"
              class="q-mb-md"
            />
            <q-input
              filled
              v-model="selected.web"
              :label="t('profile.web')"
              placeholder="https://example.com"
              class="q-mb-md"
            />
            <text-input
              v-model="selected.description"
              :label="t('profile.description')"
              min-height="50px"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="bg-grey-3">
        <q-btn flat :label="t('cancel')" color="secondary" v-close-popup />
        <q-btn :label="t('save')" color="primary" @click="onSave" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { SubjectProfile } from 'src/models';
import { notifyError } from 'src/utils/notify';
import TextInput from 'src/components/TextInput.vue';

interface DialogProps {
  modelValue: boolean;
  item: SubjectProfile | undefined;
}

const props = defineProps<DialogProps>();
const emit = defineEmits(['update:modelValue', 'saved']);

const { t } = useI18n();
const services = useServices();
const service = services.make('subject-profile');

const form = ref();
const showDialog = ref(props.modelValue);
const selected = ref<SubjectProfile>({
  email: '',
} as SubjectProfile);
const editMode = ref(false);

onMounted(() => {
  init(props.modelValue);
});

watch(
  () => props.modelValue,
  (value) => init(value),
  { immediate: true },
);

function init(value: boolean) {
  if (value) {
    // deep copy
    selected.value = JSON.parse(JSON.stringify(props.item));
    editMode.value = selected.value.id !== undefined;
  }
  showDialog.value = value;
}

function onHide() {
  showDialog.value = false;
  emit('update:modelValue', false);
}

async function onSave() {
  const valid = await form.value.validate();
  if (!valid) return;
  if (selected.value === undefined) return;
  if (selected.value.id) {
    void service
      .update(selected.value.id, selected.value)
      .then(() => {
        emit('saved', selected.value);
        onHide();
      })
      .catch(notifyError);
  } else {
    void service
      .create(selected.value)
      .then(() => {
        emit('saved', selected.value);
        onHide();
      })
      .catch(notifyError);
  }
}
</script>
