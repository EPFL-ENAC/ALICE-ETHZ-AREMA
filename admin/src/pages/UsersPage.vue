<template>
  <q-page>
    <div class="text-h5 q-pa-md">{{ $t('users') }}</div>
    <q-separator />
    <div class="q-pa-md">
      <q-table
        flat
        ref="tableRef"
        :rows="rows"
        :columns="columns"
        row-key="id"
        v-model:pagination="pagination"
        :loading="loading"
        :filter="filter"
        binary-state-sort
        @request="onRequest"
      >
        <template v-slot:top>
          <q-btn
            color="primary"
            :disable="loading"
            :label="$t('add_user')"
            @click="onAddUser"
          />
          <q-space />
          <q-select
            filled
            clearable
            v-model="roles"
            :options="roleOptions"
            :label="$t('role')"
            class="q-mr-md"
            style="min-width: 200px"
            @update:model-value="onRoleSelection"
            multiple
            emit-value
            map-options
          />
          <q-input dense debounce="300" v-model="filter">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell-email="props">
          <q-td :props="props">
            <a :href="`mailto:${props.value}`">{{ props.value }}</a>
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn
              color="grey-8"
              size="12px"
              flat
              dense
              round
              icon="edit"
              @click="onEditUser(props.row)"
            >
            </q-btn>
            <q-btn
              v-if="props.row.role === 'inactive'"
              color="grey-8"
              size="12px"
              flat
              dense
              round
              icon="play_arrow"
              @click="activeateUser(props.row)"
            >
            </q-btn>
            <q-btn
              v-if="!(props.row.role === 'inactive')"
              color="grey-8"
              size="12px"
              flat
              dense
              round
              icon="pause"
              @click="deactivateUser(props.row)"
            >
            </q-btn>
            <q-btn
              color="grey-8"
              size="12px"
              flat
              dense
              round
              icon="delete"
              @click="removeUser(props.row)"
            >
            </q-btn>
          </q-td>
        </template>
      </q-table>

      <q-dialog
        v-model="showEditUserDialog"
        persistent
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card style="width: 300px">
          <q-card-section>
            <q-input
              filled
              v-model="selectedUser.email"
              :label="$t('email')"
              class="q-mb-md"
              style="min-width: 200px"
            />
            <q-input
              v-if="!selectedUser.id"
              filled
              v-model="selectedUser.password"
              type="password"
              :label="$t('login.password')"
              class="q-mb-md"
              style="min-width: 200px"
            />
            <q-select
              filled
              clearable
              v-model="selectedUser.role"
              :options="roleOptions"
              :label="$t('role')"
              class="q-mr-md"
              style="min-width: 200px"
              emit-value
              map-options
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat :label="$t('cancel')" v-close-popup />
            <q-btn
              color="primary"
              :label="$t('save')"
              v-close-popup
              @click="saveSelectedUser"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { Query } from '@feathersjs/client';
import { User } from '@epfl-enac/arema';
const { t } = useI18n({ useScope: 'global' });
const $q = useQuasar();
const { api } = useFeathers();
const userService = api.service('users');

const columns = [
  {
    name: 'email',
    required: true,
    label: t('email'),
    align: 'left',
    field: 'email',
    sortable: true,
  },
  {
    name: 'role',
    align: 'left',
    label: t('role'),
    field: 'role',
    format: (val: string) => t(val),
    sortable: true,
  },
  {
    name: 'action',
    align: 'left',
    label: t('action'),
  },
];

const roleOptions = [
  'admin',
  'content-reviewer',
  'content-manager',
  'user',
  'guest',
  'inactive',
].map((key) => {
  return {
    value: key,
    label: t(key),
  };
});

const selectedUser = ref<User>();
const showEditUserDialog = ref(false);
const tableRef = ref();
const rows = ref<User[]>([]);
const roles = ref<string[] | null>(null);
const filter = ref('');
const loading = ref(false);
const pagination = ref({
  sortBy: 'email',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
});

onMounted(() => {
  // get initial data from server (1st page)
  tableRef.value.requestServerInteraction();
});

async function fetchFromServer(
  startRow: number,
  count: number,
  roles: string[] | null,
  filter: string,
  sortBy: string,
  descending: boolean
) {
  const query: Query = {
    $skip: startRow,
    $limit: count,
    $sort: {
      [sortBy]: descending ? -1 : 1,
    },
  };
  if (roles) {
    query.role = {
      $in: roles,
    };
  }
  if (filter) {
    query.email = {
      $like: `%${filter}%`,
    };
  }
  const result = await userService.find({
    query,
  });
  return result;
}

function onRequest(props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  const filter = props.filter;

  loading.value = true;

  // get all rows if "All" (0) is selected
  const fetchCount =
    rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;

  // calculate starting row of data
  const startRow = (page - 1) * rowsPerPage;

  // fetch data from "server"
  fetchFromServer(
    startRow,
    fetchCount,
    roles.value,
    filter,
    sortBy,
    descending
  ).then((result) => {
    // update rowsCount with appropriate value
    pagination.value.rowsNumber = result.total;

    // clear out existing data and add new
    rows.value.splice(0, rows.value.length, ...result.data);

    // don't forget to update local pagination object
    pagination.value.page = page;
    pagination.value.rowsPerPage = rowsPerPage;
    pagination.value.sortBy = sortBy;
    pagination.value.descending = descending;

    // ...and turn off loading indicator
    loading.value = false;
  });
}

function onRoleSelection() {
  console.log(roles.value);
  tableRef.value.requestServerInteraction();
}

function onAddUser() {
  selectedUser.value = { email: '', role: 'user' };
  showEditUserDialog.value = true;
}

function onEditUser(user: User) {
  selectedUser.value = { ...user };
  showEditUserDialog.value = true;
}

function saveSelectedUser() {
  if (selectedUser.value === undefined) return;
  if (selectedUser.value.id) {
    userService.patch(selectedUser.value.id, selectedUser.value).then(() => {
      tableRef.value.requestServerInteraction();
    });
  } else {
    userService.create(selectedUser.value).then(() => {
      tableRef.value.requestServerInteraction();
    });
  }
}

function activeateUser(user: User) {
  userService
    .patch(user.id, {
      role: 'guest',
    })
    .then(() => {
      tableRef.value.requestServerInteraction();
    })
    .catch((err) => {
      $q.notify({
        message: err.message,
        type: 'negative',
      });
    });
}

function deactivateUser(user: User) {
  userService
    .patch(user.id, {
      role: 'inactive',
    })
    .then(() => {
      tableRef.value.requestServerInteraction();
    })
    .catch((err) => {
      $q.notify({
        message: err.message,
        type: 'negative',
      });
    });
}

function removeUser(user: User) {
  userService
    .remove(user.id)
    .then(() => {
      tableRef.value.requestServerInteraction();
    })
    .catch((err) => {
      $q.notify({
        message: err.message,
        type: 'negative',
      });
    });
}
</script>
