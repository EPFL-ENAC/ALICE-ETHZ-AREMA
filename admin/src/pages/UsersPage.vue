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
        row-key="email"
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
            label="Add user"
            @click="onAddUser"
          />
          <q-btn
            v-if="rows.length !== 0"
            class="q-ml-sm"
            color="red"
            flat
            icon="delete"
            :disable="loading"
            title="Remove selected users"
            @click="onRemoveUsers"
          />
          <q-space />
          <q-input dense debounce="300" color="primary" v-model="filter">
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
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { Query } from '@feathersjs/client';
import { User } from '@epfl-enac/arema';

const { api } = useFeathers();
const userService = api.service('users');

const columns = [
  {
    name: 'email',
    required: true,
    label: 'Email',
    align: 'left',
    field: (row: User) => row.email,
    format: (val: User) => `${val}`,
    sortable: true,
  },
  {
    name: 'role',
    align: 'left',
    label: 'Role',
    field: 'role',
    sortable: true,
  },
];

const tableRef = ref();
const rows = ref<User[]>([]);
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
  fetchFromServer(startRow, fetchCount, filter, sortBy, descending).then(
    (result) => {
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
    }
  );
}

function onAddUser() {
  console.log('add user');
}

function onRemoveUsers() {
  console.log('remove users');
}
</script>
