<template>
  <div>
    <q-btn
      v-if="canAssign"
      size="sm"
      flat
      dense
      no-caps
      :label="entity.assigned_to || t('not_assigned')"
      :color="color"
      :title="toDatetimeString(entity.assigned_at)"
    >
      <q-menu v-if="canAssign">
        <q-list>
          <q-item clickable v-close-popup @click="onAssign(authStore.profile?.username)">
            <q-item-section>
              <q-item-label>{{ authStore.profile?.username }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <div v-else>
      <q-badge
        v-if="entity.assigned_to"
        color="accent"
        :label="entity.assigned_to"
        :title="toDatetimeString(entity.assigned_at)"
      />
      <span v-else>-</span>
    </div>
  </div>
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
import { toDatetimeString } from 'src/utils/time';

const props = defineProps<{
  entity: Entity;
  type: string;
}>();
const emit = defineEmits<{
  (e: 'assignee-changed', state: string | null | undefined): void;
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

const canAssign = computed(() => {
  return authStore.canAssign(props.entity);
});

const color = computed(() => {
  return props.entity.assigned_to
    ? authStore.profile?.username === props.entity.assigned_to
      ? 'negative'
      : 'grey-10'
    : 'grey-6';
});

onMounted(() => {
  service = services.make(props.type);
});

const onAssign = (user: string | null | undefined) => {
  if (!props.entity.id) return;
  if (!service) {
    console.error('Service is not defined for type:', props.type);
    return;
  }
  void service
    .assign(props.entity.id, user)
    .then(() => {
      emit('assignee-changed', user);
    })
    .catch(notifyError);
};
</script>
