<template>
  <q-dialog v-model="showDialog" @hide="onHide">
    <q-card class="dialog-lg">
      <q-card-section v-if="props.title">
        <div class="text-h6">{{ props.title }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-markdown :src="props.text" no-heading-anchor-links />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="bg-grey-3">
        <q-btn flat :label="t('close')" color="primary" @click="onHide" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
const { t } = useI18n()

interface DialogProps {
  modelValue: boolean
  title?: string | undefined
  text: string
}

const props = defineProps<DialogProps>()
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const showDialog = ref(props.modelValue)

watch(
  () => props.modelValue,
  (value) => {
    showDialog.value = value
  },
)

function onHide() {
  emit('update:modelValue', false)
}
</script>
