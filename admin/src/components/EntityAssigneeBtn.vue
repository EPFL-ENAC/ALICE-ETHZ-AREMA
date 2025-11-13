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
        <q-menu ref="menuRef" v-if="canAssign" @show="onInitAssignees" @hide="cancelChanges">
          <div>
            <div class="q-ma-sm">
              <q-input v-model="filter" dense debounce="300" clearable>
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="q-ma-sm">
              <q-btn-group flat spread>
                <q-btn :label="t('cancel')" size="sm" @click="cancelChanges" />
                <q-btn :label="t('apply')" color="primary" size="sm" @click="applyChanges" />
              </q-btn-group>
            </div>
          </div>
          <q-spinner-dots v-if="usersStore.loading" size="lg" color="primary" class="q-pa-sm" />
          <q-scroll-area v-else visible style="height: 200px; max-width: 300px">
            <q-list>
              <template v-for="user in users" :key="user.username">
                <q-item
                  clickable
                  @click="onAssign(user.username)"
                  :active="isUserAssigned(user.username)"
                >
                  <q-item-section>
                    <q-item-label>{{ user.username }}</q-item-label>
                    <q-item-label class="text-hint">{{ getUserDisplayName(user) }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-scroll-area>
        </q-menu>
      </q-btn>
      <q-btn
        v-if="entity.assigned_to"
        @click="clearAssignees"
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
import type { AppUser } from 'src/models';
import { QMenu } from 'quasar';

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

const menuRef = ref<QMenu | null>(null);
const filter = ref<string>('');
const assignees = ref<string[]>([]);
const canceled = ref(false);

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

function getUserDisplayName(user: AppUser): string {
  return (
    `${user.first_name ?? ''} ${user.first_name?.endsWith(user.last_name || '') ? '' : user.last_name}` +
    (user.email !== user.username ? ` <${user.email}>` : '')
  );
}

function isUserAssigned(username: string): boolean {
  return assignees.value.includes(username);
}

function onInitAssignees() {
  canceled.value = false;
  if (props.entity.assigned_to) {
    assignees.value = props.entity.assigned_to.split(',').map((assignee) => assignee.trim());
  } else {
    assignees.value = [];
  }
}

function onAssign(username: string | null | undefined) {
  // split assignee on comma and trim spaces
  if (username && assignees.value.includes(username)) {
    // already assigned: remove user from assignees
    assignees.value = assignees.value.filter((assignee) => assignee !== username);
  } else if (username) {
    // add user to assignees
    assignees.value = assignees.value ? [...assignees.value, username] : [username];
  } else {
    // clear all assignees
    assignees.value = [];
  }
}

function clearAssignees() {
  canceled.value = false;
  assignees.value = [];
  onApplyAssignees();
}

function onApplyAssignees() {
  if (canceled.value) return;
  if (!props.entity.id) return;
  if (!service) {
    console.error('Service is not defined for type:', props.type);
    return;
  }
  const assigneesStr = assignees.value.length > 0 ? assignees.value.join(', ') : null;
  void service
    .assign(props.entity.id, assigneesStr)
    .then(() => {
      emit('assignee-changed', assigneesStr);
    })
    .catch(notifyError);
}

function cancelChanges() {
  if (menuRef.value === null) return;
  canceled.value = true;
  menuRef.value.hide();
}

function applyChanges() {
  if (menuRef.value === null) return;
  canceled.value = false;
  menuRef.value.hide();
  onApplyAssignees();
}
</script>
