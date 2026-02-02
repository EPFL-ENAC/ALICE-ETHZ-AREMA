<template>
  <q-dialog v-model="showDialog" persistent @hide="onHide">
    <q-card class="dialog-sm">
      <q-card-actions>
        <div class="text-h6 q-ml-sm">{{ t('reset_password') }}</div>
        <q-space />
        <q-btn flat icon="close" color="primary" v-close-popup />
      </q-card-actions>
      <q-separator />

      <q-card-section>
        <q-input
          filled
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          :label="t('password') + ' *'"
          :hint="t('password_temp_hint')"
          class="q-mb-md"
        >
          <template v-slot:append>
            <q-icon
              name="visibility"
              class="cursor-pointer on-left"
              size="xs"
              @click="showPassword = !showPassword"
            />
            <q-icon
              name="content_copy"
              size="xs"
              class="cursor-pointer on-left"
              @click="onCopyPassword"
            />
            <q-icon name="electric_bolt" class="cursor-pointer" @click="onGeneratePassword" />
          </template>
        </q-input>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="bg-grey-3">
        <q-btn flat :label="t('cancel')" color="secondary" v-close-popup />
        <q-btn :label="t('save')" color="primary" @click="onSave" :disable="!isValid" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { copyToClipboard } from 'quasar';
import type { AppUser } from 'src/models';
import { notifyError, notifySuccess } from 'src/utils/notify';
import { generateToken } from 'src/utils/generate';

interface DialogProps {
  modelValue: boolean;
  item: AppUser;
}

const props = defineProps<DialogProps>();
const emit = defineEmits(['update:modelValue', 'saved']);

const { t } = useI18n();
const usersStore = useUsersStore();

const showDialog = ref(props.modelValue);
const showPassword = ref(false);
const password = ref('');
const isValid = computed(() => {
  return password.value?.trim().length > 0;
});

watch(
  () => props.modelValue,
  (value) => {
    showDialog.value = value;
    onGeneratePassword();
  },
);

function onHide() {
  showDialog.value = false;
  emit('update:modelValue', false);
}

function onSave() {
  if (password.value) {
    void usersStore
      .update_password(props.item, password.value)
      .then(() => {
        emit('saved');
        onHide();
      })
      .catch(notifyError);
  }
}

function onGeneratePassword() {
  password.value = generateToken(12);
}

function onCopyPassword() {
  void copyToClipboard(password.value)
    .then(() => {
      notifySuccess('password_copied');
    })
    .catch(notifyError);
}
</script>
