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
          />
          <q-input
            v-if="!editMode"
            filled
            v-model="selected.password"
            :type="showPassword ? 'text' : 'password'"
            :label="t('password') + ' *'"
            :hint="t('password_temp_hint')"
            lazy-rules
            :rules="[(val) => !!val || t('field_required')]"
          >
            <template v-slot:append>
              <q-icon
                name="visibility"
                size="xs"
                class="cursor-pointer on-left"
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
          <q-input
            filled
            v-model="selected.first_name"
            :label="t('first_name') + ' *'"
            lazy-rules
            :rules="[(val) => !!val || t('field_required')]"
          />
          <q-input
            filled
            v-model="selected.last_name"
            :label="t('last_name') + ' *'"
            lazy-rules
            :rules="[(val) => !!val || t('field_required')]"
          />
          <div class="q-mb-lg">
            <div class="text-grey-8 q-mb-sm">{{ t('role') + ' *' }}</div>
            <q-option-group v-model="role" dense :options="roleOptions" color="primary" inline />
            <div class="text-hint q-mt-sm">{{ t('roles_hint') }}</div>
          </div>
          <div>
            <q-checkbox v-model="selected.enabled" :label="t('enabled')" dense />
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
const role = ref('app-contributor'); // Default role

const roleOptions = [
  { label: t('roles.contributor'), value: 'app-contributor' },
  { label: t('roles.reviewer'), value: 'app-reviewer' },
  { label: t('roles.administrator'), value: 'app-administrator' },
];

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
      role.value = selected.value.roles?.includes('app-administrator')
        ? 'app-administrator'
        : selected.value.roles?.includes('app-reviewer')
          ? 'app-reviewer'
          : 'app-contributor';
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
  ['app-administrator', 'app-reviewer', 'app-contributor'].forEach((role) => {
    const index = selected.value.roles.indexOf(role);
    if (index !== -1) {
      selected.value.roles.splice(index, 1);
    }
  });
  if (role.value === 'app-administrator') {
    selected.value.roles.push('app-administrator');
  } else if (role.value === 'app-reviewer') {
    selected.value.roles.push('app-reviewer');
  } else {
    selected.value.roles.push('app-contributor');
  }
  if (selected.value.id) {
    void usersStore
      .update(selected.value)
      .then(() => {
        emit('saved', selected.value);
        onHide();
      })
      .catch(notifyError);
  } else {
    void usersStore
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
  void copyToClipboard(selected.value.password)
    .then(() => {
      notifySuccess('password_copied');
    })
    .catch(notifyError);
}
</script>
