<template>
  <q-page>
    <div class="text-h5 q-pa-md">{{ t('users') }}</div>
    <q-separator />
    <div class="q-pa-md">
      <q-table
        flat
        :rows="users"
        :columns="columns"
        row-key="id"
        :pagination="initialPagination"
        :loading="usersStore.loading"
        :rows-per-page-options="[10, 25, 50, 0]"
        :filter="filter"
      >
        <template v-slot:top>
          <q-btn
            size="sm"
            color="primary"
            :disable="usersStore.loading"
            :label="t('add')"
            icon="add"
            @click="onAdd"
          />
          <q-space />
          <q-input dense debounce="300" v-model="filter" clearable>
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell-email="props">
          <q-td :props="props">
            <a :href="`mailto:${props.row.email}`" class="epfl">{{ props.row.email }}</a>
          </q-td>
        </template>
        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            {{ getFullname(props.row) }}
          </q-td>
        </template>
        <template v-slot:body-cell-roles="props">
          <q-td :props="props">
            <q-chip
              v-for="role in props.row.roles.filter(
                (r: string) => r.startsWith('app-') && r !== 'app-user',
              )"
              :key="role"
              class="q-ml-none q-mr-sm"
              :color="
                role === 'app-administrator'
                  ? 'primary'
                  : role === 'app-reviewer'
                    ? 'secondary'
                    : 'grey'
              "
              text-color="white"
              size="12px"
            >
              {{ t(role.replace('app-', 'roles.')) }}
            </q-chip>
          </q-td>
        </template>
        <template v-slot:body-cell-enabled="props">
          <q-td :props="props">
            <q-icon
              :name="props.row.enabled ? 'check' : 'close'"
              :color="props.row.enabled ? 'positive' : 'negative'"
              size="20px"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn
              v-if="!props.row.email.endsWith('@epfl.ch')"
              color="grey-8"
              size="12px"
              flat
              dense
              round
              icon="electric_bolt"
              :title="t('reset_password')"
              @click="onPassword(props.row)"
            >
            </q-btn>
            <q-btn
              v-if="!props.row.email.endsWith('@epfl.ch')"
              color="grey-8"
              size="12px"
              flat
              dense
              round
              icon="edit"
              :title="t('edit')"
              @click="onEdit(props.row)"
            >
            </q-btn>
            <q-btn
              v-if="!props.row.email.endsWith('@epfl.ch')"
              color="grey-8"
              size="12px"
              flat
              dense
              round
              icon="delete"
              :title="t('remove')"
              @click="onConfirmRemove(props.row)"
            >
            </q-btn>
          </q-td>
        </template>
      </q-table>
      <user-dialog v-model="showDialog" :item="selected" @saved="usersStore.init" />
      <user-password-dialog v-model="showPasswordDialog" :item="selected" />
      <confirm-dialog
        v-model="showRemoveDialog"
        :title="t('remove_user')"
        :text="t('remove_user_text', { name: selected.email })"
        @confirm="onRemove()"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import type { Alignment } from 'src/components/models';
import type { AppUser } from 'src/models';
import UserDialog from 'src/components/UserDialog.vue';
import UserPasswordDialog from 'src/components/UserPasswordDialog.vue';
import ConfirmDialog from 'src/components/ConfirmDialog.vue';
import { notifyError } from 'src/utils/notify';

const { t } = useI18n({ useScope: 'global' });
const usersStore = useUsersStore();
const authStore = useAuthStore();

const filter = ref('');
const showDialog = ref(false);
const showPasswordDialog = ref(false);
const showRemoveDialog = ref(false);
const selected = ref<AppUser>({} as AppUser);
const initialPagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
});

const users = computed(() => {
  if (!filter.value) {
    return usersStore.users;
  }
  return usersStore.users.filter((user) => {
    const search = filter.value.toLowerCase();
    return (
      user.email.toLowerCase().includes(search) ||
      (user.first_name && user.first_name.toLowerCase().includes(search)) ||
      (user.last_name && user.last_name.toLowerCase().includes(search)) ||
      (user.roles && user.roles.some((role) => role.toLowerCase().includes(search)))
    );
  });
});

const columns = computed(() => {
  const cols = [
    {
      name: 'email',
      required: true,
      label: t('email'),
      align: 'left' as Alignment,
      field: 'email',
      sortable: true,
      style: '',
    },
    {
      name: 'name',
      required: true,
      label: t('name'),
      align: 'left' as Alignment,
      field: 'name',
      sortable: true,
    },
    {
      name: 'roles',
      required: true,
      label: t('role'),
      align: 'left' as Alignment,
      field: 'roles',
      sortable: true,
    },
    {
      name: 'enabled',
      required: true,
      label: t('enabled'),
      align: 'left' as Alignment,
      field: 'enabled',
      sortable: true,
    },
  ];

  if (authStore.isAdmin) {
    cols.splice(1, 0, {
      name: 'action',
      align: 'right' as Alignment,
      label: '',
      field: 'action',
      required: false,
      sortable: false,
      style: 'min-width: 100px',
    });
  }
  return cols;
});

onMounted(() => {
  void usersStore.init().catch(() => {});
});

watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      void usersStore.init();
    }
  },
);

function getFullname(user: AppUser) {
  return `${user.first_name ?? ''} ${user.first_name?.endsWith(user.last_name || '') ? '' : user.last_name}`;
}

function onAdd() {
  selected.value = {} as AppUser;
  showDialog.value = true;
}

function onPassword(user: AppUser) {
  selected.value = user;
  showPasswordDialog.value = true;
}

function onEdit(user: AppUser) {
  selected.value = user;
  showDialog.value = true;
}

function onConfirmRemove(user: AppUser) {
  selected.value = user;
  showRemoveDialog.value = true;
}

function onRemove() {
  if (selected.value?.id)
    void usersStore
      .remove(selected.value.id)
      .catch(notifyError)
      .finally(() => void usersStore.init());
}
</script>
