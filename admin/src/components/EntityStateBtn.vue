<template>
  <q-btn size="sm" flat dense no-caps :label="t(`states.${entity.state}`)" icon-right="more_vert">
    <q-menu>
      <q-list>
        <q-item
          v-if="authStore.canInReview(entity)"
          clickable
          v-close-popup
          @click="onState('in-review')"
        >
          <q-item-section avatar>
            <q-avatar icon="visibility" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ t('states.in-review') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          v-if="authStore.canToPublish(entity)"
          clickable
          v-close-popup
          @click="onState('to-publish')"
        >
          <q-item-section avatar>
            <q-avatar icon="publish" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ t('states.to-publish') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          v-if="authStore.canToUnpublish(entity)"
          clickable
          v-close-popup
          @click="onState('to-unpublish')"
        >
          <q-item-section avatar>
            <q-avatar icon="download" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ t('states.to-unpublish') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          v-if="authStore.canToDelete(entity)"
          clickable
          v-close-popup
          @click="onState('to-delete')"
        >
          <q-item-section avatar>
            <q-avatar icon="delete" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ t('states.to-delete') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="authStore.canDraft(entity)" clickable v-close-popup @click="onState('draft')">
          <q-item-section avatar>
            <q-avatar icon="edit" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ t('states.draft') }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import type {
  Entity,
  NaturalResource,
  TechnicalConstruction,
  BuildingMaterial,
  Building,
  Professional,
  BuildingElement,
} from 'src/models';
import type { Service } from 'src/stores/services';
import { notifyError } from 'src/utils/notify';

const props = defineProps<{
  entity: Entity;
  type: string;
}>();
const emit = defineEmits<{
  (e: 'state-changed', state: string): void;
}>();

const authStore = useAuthStore();
const { t } = useI18n();
const services = useServices();
let service:
  | Service<
      | NaturalResource
      | TechnicalConstruction
      | BuildingMaterial
      | Building
      | Professional
      | BuildingElement
    >
  | undefined = undefined;

onMounted(() => {
  service = services.make(props.type);
});

const onState = (state: string) => {
  if (!props.entity.id) return;
  if (!service) {
    console.error('Service is not defined for type:', props.type);
    return;
  }
  void service
    .setState(props.entity.id, state)
    .then(() => {
      emit('state-changed', state);
    })
    .catch(notifyError);
};
</script>
