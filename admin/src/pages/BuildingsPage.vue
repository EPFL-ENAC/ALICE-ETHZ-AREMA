<template>
  <q-page>
    <div class="text-h5 q-pa-md">{{ $t('buildings') }}</div>
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
          <q-input dense debounce="300" v-model="filter">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell-description="props">
          <q-td :props="props" class="ellipsis" style="max-width: 200px">
            {{ props.value }}
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
              v-model="selected.name"
              :label="$t('name')"
              class="q-mb-md"
              style="min-width: 200px"
            />
            <q-input
              filled
              v-model="selected.description"
              autogrow
              :label="$t('description')"
              class="q-mb-md"
              style="min-width: 200px"
            />
            <q-input
              filled
              v-model="selected.address"
              :label="$t('address')"
              class="q-mb-md"
              style="min-width: 200px"
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
import { Building } from '@epfl-enac/arema';
const { t } = useI18n({ useScope: 'global' });
const $q = useQuasar();
const { api } = useFeathers();
const service = api.service('building');

const columns = [
  {
    name: 'name',
    required: true,
    label: t('name'),
    align: 'left',
    field: 'name',
    sortable: true,
  },
  {
    name: 'description',
    required: true,
    label: t('description'),
    align: 'left',
    field: 'description',
    sortable: false,
  },
  {
    name: 'address',
    required: true,
    label: t('address'),
    align: 'left',
    field: 'address',
    sortable: false,
  },
  {
    name: 'lastModification',
    required: true,
    label: t('last_modification'),
    align: 'left',
    field: (row: Building) => {
      const date = new Date(row.updatedAt || row.createdAt);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    },
    sortable: false,
  },
  {
    name: 'action',
    align: 'left',
    label: t('action'),
  },
];

const selected = ref<Building>();
const showEditDialog = ref(false);
const tableRef = ref();
const rows = ref<Building[]>([]);
const filter = ref('');
const loading = ref(false);
const pagination = ref({
  sortBy: 'name',
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
    query.$or = [
      {
        name: {
          $like: `%${filter}%`,
        },
      },
      {
        address: {
          $like: `%${filter}%`,
        },
      },
    ];
  }
  const result = await service.find({
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

function onAdd() {
  selected.value = {};
  showEditDialog.value = true;
}

function onEdit(resource: Building) {
  selected.value = { ...resource };
  showEditDialog.value = true;
}

function saveSelected() {
  if (selected.value === undefined) return;
  if (selected.value.id) {
    delete selected.value.createdAt;
    delete selected.value.createdById;
    delete selected.value.updatedAt;
    delete selected.value.updatedById;
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
    selected.value.images = [];
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

function remove(resource: Building) {
  service
    .remove(resource.id)
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
