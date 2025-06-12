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
          <q-input
            filled
            v-model="selected.email"
            :disable="editMode"
            :label="t('email') + ' *'"
            lazy-rules
            :rules="[(val) => !!val || t('field_required')]"
            class="q-mb-md"
          />
          <q-input
            v-if="!editMode"
            filled
            v-model="selected.password"
            :type="showPassword ? 'text' : 'password'"
            :label="t('password') + ' *'"
            :hint="t('password_hint')"
            lazy-rules
            :rules="[(val) => !!val || t('field_required')]"
            class="q-mb-md"
          >
            <template v-slot:append>
              <q-icon
                name="visibility"
                size="xs"
                class="cursor-pointer on-left"
                @click="showPassword = !showPassword"
              />
              <q-icon name="content_copy" size="xs" class="cursor-pointer on-left" @click="onCopyPassword" />
              <q-icon name="electric_bolt" class="cursor-pointer" @click="onGeneratePassword" />
            </template>
          </q-input>
          <q-input
            filled
            v-model="selected.first_name"
            :label="t('first_name') + ' *'"
            lazy-rules
            :rules="[(val) => !!val || t('field_required')]"
            class="q-mb-md"
          />
          <q-input
            filled
            v-model="selected.last_name"
            :label="t('last_name') + ' *'"
            lazy-rules
            :rules="[(val) => !!val || t('field_required')]"
            class="q-mb-md"
          />
          <div>
            <q-checkbox v-model="isAdministrator" :label="t('administrator')" class="q-mb-md" />
          </div>
          <div>
            <q-checkbox v-model="selected.enabled" :label="t('enabled')" class="q-mb-md" />
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
import { copyToClipboard } from 'quasar';
import type { AppUser } from 'src/models';
import { notifyError, notifySuccess } from 'src/utils/notify';
import { generateToken } from 'src/utils/generate';

interface DialogProps {
  modelValue: boolean;
  item: AppUser | undefined;
}

const props = defineProps<DialogProps>();
const emit = defineEmits(['update:modelValue', 'saved']);

const { t } = useI18n();
const usersStore = useUsersStore();

const form = ref();
const showDialog = ref(props.modelValue);
const showPassword = ref(false);
const selected = ref<AppUser>({
  email: '',
} as AppUser);
const editMode = ref(false);
const isAdministrator = ref(false);

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      // deep copy
      selected.value = JSON.parse(JSON.stringify(props.item));
      if (selected.value.enabled === undefined) {
        selected.value.enabled = true;
      }
      editMode.value = selected.value.id !== undefined;
      if (!editMode.value) {
        onGeneratePassword();
      }
      isAdministrator.value = selected.value.roles?.includes('app-administrator') ?? false;
    }
    showDialog.value = value;
  },
);

function onHide() {
  showDialog.value = false;
  emit('update:modelValue', false);
}

async function onSave() {
  const valid = await form.value.validate();
  if (!valid) return;
  if (selected.value === undefined) return;
  if (selected.value.roles === undefined) {
    selected.value.roles = [];
  }
  if (isAdministrator.value) {
    if (!selected.value.roles.includes('app-administrator')) {
      selected.value.roles.push('app-administrator');
    }
  } else {
    const index = selected.value.roles.indexOf('app-administrator');
    if (index !== -1) {
      selected.value.roles.splice(index, 1);
    }
  }
  if (selected.value.id) {
    usersStore
      .update(selected.value)
      .then(() => {
        emit('saved', selected.value);
        onHide();
      })
      .catch(notifyError);
  } else {
    usersStore
      .create(selected.value)
      .then(() => {
        emit('saved', selected.value);
        onHide();
      })
      .catch(notifyError);
  }
}

function onGeneratePassword() {
  selected.value.password = generateToken(12);
}

function onCopyPassword() {
  if (selected.value.password === undefined) return;
  copyToClipboard(selected.value.password)
    .then(() => {
      notifySuccess('password_copied');
    })
    .catch(notifyError);
}
</script>
