<template>
  <q-dialog v-model="showDialog" persistent maximized @hide="onHide" backdrop-filter="blur(8px)">
    <q-card class="flex justify-center">
      <q-card-actions>
        <span class="text-primary text-h5">{{ t('main.brand') }}</span>
      </q-card-actions>
      <q-card-actions>
        <q-btn outline icon-right="login" :label="t('login')" color="primary" @click="onLogin" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
interface DialogProps {
  modelValue: boolean;
}

const props = defineProps<DialogProps>();
const emit = defineEmits(['update:modelValue', 'saved']);

const { t } = useI18n();
const authStore = useAuthStore();
const showDialog = ref(props.modelValue);

watch(
  () => props.modelValue,
  (value) => {
    showDialog.value = value;
  },
);

function onHide() {
  showDialog.value = false;
  emit('update:modelValue', false);
}

async function onLogin() {
  authStore.login();
}
</script>
