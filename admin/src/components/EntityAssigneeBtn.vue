<template>
  <div>
    <div v-if="canAssign">
      <q-btn
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
            <div>
              <q-input v-model="filter" dense debounce="300" clearable class="q-pa-sm">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <template v-for="user in users" :key="user.username">
              <q-item clickable v-close-popup @click="onAssign(user.username)">
                <q-item-section>
                  <q-item-label>{{ user.username }}</q-item-label>
                  <q-item-label class="text-hint">{{
                    `${user.first_name ?? ''} ${user.first_name?.endsWith(user.last_name || '') ? '' : user.last_name}` +
                    (user.email !== user.username ? ` <${user.email}>` : '')
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-menu>
      </q-btn>
      <q-btn
        v-if="entity.assigned_to"
        @click="onAssign(null)"
        icon="clear"
        dense
        flat
        size="sm"
        class="q-ml-xs"
      ></q-btn>
    </div>
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
const usersStore = useUsersStore();
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

const filter = ref<string>('');

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

const users = computed(() => {
  const experts = usersStore.users.filter(
    (user) => user.roles?.includes('app-administrator') || user.roles?.includes('app-reviewer'),
  );
  if (!filter.value || filter.value.trim().length === 0) return experts;
  return experts.filter((user) =>
    `${user.username} ${user.first_name} ${user.last_name} ${user.email}`
      .toLowerCase()
      .includes(filter.value.toLowerCase()),
  );
});

onMounted(async () => {
  service = services.make(props.type);
  await loadUsers();
});

watch(
  () => authStore.isAuthenticated,
  async (isAuthenticated) => {
    if (isAuthenticated) {
      await loadUsers();
    }
  },
);

async function loadUsers() {
  if (usersStore.users.length === 0 && usersStore.loading === false) {
    await usersStore.init();
  }
}

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
