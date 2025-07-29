<template>
  <div>
    <q-btn
      v-if="authStore.canEdit(entity)"
      color="grey-8"
      size="12px"
      flat
      dense
      round
      icon="edit"
      :title="t('edit')"
      @click="onEdit()"
    >
    </q-btn>
    <q-btn
      v-if="authStore.canPublish(entity)"
      color="secondary"
      size="12px"
      flat
      dense
      round
      icon="publish"
      :title="t('publish')"
      @click="onPublish()"
    >
    </q-btn>
    <q-btn
      v-if="authStore.canUnpublish(entity)"
      color="secondary"
      size="12px"
      flat
      dense
      round
      icon="download"
      :title="t('unpublish')"
      @click="onUnpublish()"
    >
    </q-btn>
    <q-btn
      v-if="authStore.canDelete(entity)"
      color="negative"
      size="12px"
      flat
      dense
      round
      icon="delete"
      :title="t('remove')"
      @click="onConfirmRemove()"
    >
    </q-btn>
    <q-btn
      v-if="authStore.canLock(entity)"
      color="grey-8"
      size="10px"
      flat
      dense
      round
      :icon="entity.state === 'locked' ? 'lock_open' : 'lock'"
      :title="t('lock_unlock')"
      @click="onToggleLock()"
    >
    </q-btn>
    <confirm-dialog
      v-model="showConfirmDialog"
      :title="t('remove')"
      :text="t('confirm_remove', { name: entity?.name })"
      @confirm="onRemove()"
    />
  </div>
</template>

<script setup lang="ts">
import type { Entity } from 'src/models';
import ConfirmDialog from 'src/components/ConfirmDialog.vue';

defineProps<{
  entity: Entity;
}>();
const emit = defineEmits<{
  (e: 'action', action: string): void;
}>();

const authStore = useAuthStore();
const { t } = useI18n();

const showConfirmDialog = ref(false);

const onConfirmRemove = () => {
  showConfirmDialog.value = true;
};

const onEdit = () => {
  emit('action', 'edit');
};

const onPublish = () => {
  emit('action', 'publish');
};

const onUnpublish = () => {
  emit('action', 'unpublish');
};

const onRemove = () => {
  emit('action', 'remove');
};

const onToggleLock = () => {
  emit('action', 'lock');
};
</script>
