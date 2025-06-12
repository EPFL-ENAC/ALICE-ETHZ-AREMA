<template>
  <q-page>
    <div class="text-h5 q-pa-md">{{ t('users') }}</div>
    <q-separator />
    <div class="q-pa-md">
      <q-table
        flat
        :rows="usersStore.users"
        :columns="columns"
        row-key="id"
        :pagination="initialPagination"
        :loading="usersStore.loading"
        :rows-per-page-options="[10, 25, 50, 0]"
      >
        <template v-slot:top>
          <q-btn size="sm" color="primary" :disable="usersStore.loading" :label="t('add')" icon="add" @click="onAdd" />
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
          <q-td :props="props"> {{ props.row.first_name }} {{ props.row.last_name }} </q-td>
        </template>
        <template v-slot:body-cell-roles="props">
          <q-td :props="props">
            <q-icon
              :name="props.row.roles.includes('app-administrator') ? 'check' : 'close'"
              :color="props.row.roles.includes('app-administrator') ? 'positive' : 'negative'"
              size="20px"
            />
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
import { DefaultAlignment } from 'src/components/models';
import type { AppUser } from 'src/models';
import UserDialog from 'src/components/UserDialog.vue';
import UserPasswordDialog from 'src/components/UserPasswordDialog.vue';
import ConfirmDialog from 'src/components/ConfirmDialog.vue';
import { notifyError } from 'src/utils/notify';

const { t } = useI18n({ useScope: 'global' });
const usersStore = useUsersStore();

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

const columns = computed(() => {
  return [
    {
      name: 'email',
      required: true,
      label: t('email'),
      align: DefaultAlignment,
      field: 'email',
      sortable: true,
    },
    {
      name: 'name',
      required: true,
      label: t('name'),
      align: DefaultAlignment,
      field: 'name',
      sortable: true,
    },
    {
      name: 'roles',
      required: true,
      label: t('administrator'),
      align: DefaultAlignment,
      field: 'roles',
      sortable: true,
    },
    {
      name: 'enabled',
      required: true,
      label: t('enabled'),
      align: DefaultAlignment,
      field: 'enabled',
      sortable: true,
    },
    {
      name: 'action',
      align: DefaultAlignment,
      label: '',
      required: false,
      field: 'action',
      sortable: false,
    },
  ];
});

onMounted(() => {
  usersStore.init();
});

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
    usersStore
      .remove(selected.value.id)
      .catch(notifyError)
      .finally(() => usersStore.init());
}
</script>
