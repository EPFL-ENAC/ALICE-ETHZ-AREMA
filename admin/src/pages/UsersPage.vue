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
            :label="$t('add')"
            icon="add"
            @click="onAdd"
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
              @click="onEdit(props.row)"
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
              @click="activate(props.row)"
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
              @click="deactivate(props.row)"
            >
            </q-btn>
            <q-btn
              color="grey-8"
              size="12px"
              flat
              dense
              round
              icon="delete"
              @click="remove(props.row)"
            >
            </q-btn>
          </q-td>
        </template>
      </q-table>

      <q-dialog
        v-model="showEditDialog"
        persistent
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card style="width: 300px">
          <q-card-section>
            <q-input
              filled
              v-model="selected.email"
              :label="$t('email')"
              class="q-mb-md"
              style="min-width: 200px"
            />
            <q-input
              filled
              v-model="selected.password"
              type="password"
              :label="$t('login.password')"
              :hint="selected.id ? $t('password_edit_hint') : ''"
              class="q-mb-md"
              style="min-width: 200px"
            />
            <q-select
              filled
              clearable
              v-model="selected.role"
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
              @click="saveSelected"
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
const service = api.service('users');

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

const selected = ref<User>();
const showEditDialog = ref(false);
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

function fetchFromServer(
  startRow: number,
  count: number,
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
  if (roles.value) {
    query.role = {
      $in: roles.value,
    };
  }
  if (filter) {
    query.email = {
      $like: `%${filter}%`,
    };
  }
  return service.find({
    query,
  });
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
    filter,
    sortBy,
    descending
  )
  .then((result) => {
    rows.value = result.data;
    pagination.value = { ...props.pagination, rowsNumber: result.total,  };
    loading.value = false;
  })
  .catch((err) => {
    $q.notify({
      message: err.message,
      type: 'negative',
    });
  });
}

function onRoleSelection() {
  tableRef.value.requestServerInteraction();
}

function onAdd() {
  selected.value = { email: '', role: 'user' };
  showEditDialog.value = true;
}

function onEdit(user: User) {
  selected.value = { ...user };
  showEditDialog.value = true;
}

function saveSelected() {
  if (selected.value === undefined) return;
  if (selected.value.id) {
    service
      .patch(selected.value.id, selected.value)
      .then(() => {
        tableRef.value.requestServerInteraction();
      })
      .catch((err) => {
        $q.notify({
          message: err.message,
          type: 'negative',
        });
      });
  } else {
    service
      .create(selected.value)
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
}

function activate(user: User) {
  service
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

function deactivate(user: User) {
  service
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

function remove(user: User) {
  service
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
