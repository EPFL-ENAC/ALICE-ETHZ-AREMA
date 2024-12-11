<template>
  <q-page>
    <div class="text-h5 q-pa-md">{{ $t('natural_resources') }}</div>
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
        :rows-per-page-options="[10, 25, 50]"
      >
        <template v-slot:top>
          <q-btn
            v-if="authStore.isAdmin"
            size="sm"
            color="primary"
            :disable="loading"
            :label="$t('add')"
            icon="add"
            @click="onAdd"
          />
          <q-btn
            v-if="authStore.isAdmin"
            size="sm"
            color="primary"
            :disable="loading"
            :label="$t('index')"
            icon="manage_search"
            @click="onIndex"
            class="on-right"
          />
          <q-space />
          <taxonomy-select
            v-model="types"
            entity-type="natural-resource"
            path="type"
            :label="$t('types')"
            multiple
            dense
            style="min-width: 200px"
            class="q-mr-md"
            @update:model-value="onTypeSelection"
          />
          <q-input dense debounce="300" v-model="filter" clearable>
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell-type="props">
          <q-td :props="props">
            <q-badge color="accent" :label="props.value" />
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

      <natural-resource-dialog
        v-model="showEditDialog"
        :item="selected"
        @saved="onSaved"
      ></natural-resource-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { Option, Query } from 'src/components/models';
import { NaturalResource } from 'src/models';
import NaturalResourceDialog from 'src/components/NaturalResourceDialog.vue';
import TaxonomySelect from 'src/components/TaxonomySelect.vue';
import { makePaginationRequestHandler } from 'src/utils/pagination';
import type { PaginationOptions } from 'src/utils/pagination';

const { t } = useI18n({ useScope: 'global' });
const $q = useQuasar();
const authStore = useAuthStore();
const taxonomyStore = useTaxonomyStore();
const services = useServices();
const service = services.make('natural-resource');

const columns = computed(() => {
  const cols = [
    {
      name: 'id',
      required: true,
      label: 'ID',
      align: 'left',
      field: 'id',
      style: 'width: 20px',
      sortable: true,
    },
    {
      name: 'name',
      required: true,
      label: t('name'),
      align: 'left',
      field: 'name',
      sortable: true,
    },
    {
      name: 'type',
      required: true,
      label: t('type'),
      align: 'left',
      field: 'type',
      format: getTypeLabel,
      sortable: true,
    },
    {
      name: 'lastModification',
      required: true,
      label: t('last_modification'),
      align: 'left',
      field: (row: NaturalResource) => {
        const date = new Date(row.updated_at || row.created_at || '');
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      },
      sortable: false,
    },
  ];

  if (authStore.isAdmin) {
    cols.push({
      name: 'action',
      align: 'left',
      label: t('action'),
    });
  }

  return cols;
});

const selected = ref<NaturalResource>();
const showEditDialog = ref(false);
const tableRef = ref();
const rows = ref<NaturalResource[]>([]);
const types = ref<string[] | null>(null);
const filter = ref('');
const loading = ref(false);
const pagination = ref<PaginationOptions>({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
});
const naturalResourcesTypes = ref<Option[]>([]);

onMounted(() => {
  tableRef.value.requestServerInteraction();
  taxonomyStore.getTaxonomyNode('natural-resource', 'type').then((types) => {
    naturalResourcesTypes.value = taxonomyStore.asOptions(
      'natural-resource',
      types,
      'type',
    );
  });
});

function fetchFromServer(
  startRow: number,
  count: number,
  filter: string,
  sortBy: string,
  descending: boolean,
) {
  const query: Query = {
    $skip: startRow,
    $limit: count,
    $sort: [sortBy, descending],
  };
  query.filter = {};
  if (types.value?.length) {
    query.filter.$or = types.value.map((val) => {
      return {
        type: {
          $like: val,
        },
      };
    });
  }
  if (filter) {
    const criterion = {
      name: { $ilike: `%${filter}%` },
    };
    if (query.filter.$or) {
      const typesClause = query.filter.$or;
      delete query.filter.$or;
      query.filter.$and = [{ $or: typesClause }, criterion];
    } else query.filter = criterion;
  }
  return service.find(query).then((result) => {
    rows.value = result.data;
    loading.value = false;
    return result;
  });
}

const onRequest = makePaginationRequestHandler(fetchFromServer, pagination);

function onTypeSelection() {
  tableRef.value.requestServerInteraction();
}

function onIndex() {
  loading.value = true;
  service
    .index()
    .then((result) => {
      $q.notify({
        message: t('all_items_indexed', { count: result }),
        type: 'positive',
      });
    })
    .finally(() => {
      loading.value = false;
    });
}

function onAdd() {
  selected.value = { name: '' };
  showEditDialog.value = true;
}

function onEdit(item: NaturalResource) {
  selected.value = { ...item };
  showEditDialog.value = true;
}

function onSaved() {
  tableRef.value.requestServerInteraction();
}

function remove(item: NaturalResource) {
  if (!item.id) return;
  service
    .remove(item.id)
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

function getTypeLabel(val: string): string {
  return (
    naturalResourcesTypes.value.find((opt) => opt.value === val)?.label || val
  );
}
</script>
