<template>
  <q-page>
    <div class="text-h5 q-pa-md">{{ t('natural_resources') }}</div>
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
        :rows-per-page-options="[10, 25, 50, 0]"
      >
        <template v-slot:top>
          <q-btn
            v-if="authStore.isAdmin || authStore.isReviewer"
            size="sm"
            color="primary"
            :disable="loading"
            :label="t('add')"
            icon="add"
            @click="onAdd"
          />
          <q-btn
            v-if="authStore.isAdmin"
            size="sm"
            color="primary"
            :disable="loading"
            :label="t('index_all')"
            icon="manage_search"
            @click="onIndex"
            class="on-right"
          />
          <q-space />
          <taxonomy-select
            v-model="types"
            entity-type="natural-resource"
            path="type"
            :label="t('types')"
            multiple
            dense
            style="min-width: 200px"
            class="q-mr-md"
            @update:model-value="onRefresh"
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
        <template v-slot:body-cell-published="props">
          <q-td :props="props">
            <div
              :title="
                props.row.published_at === undefined
                  ? t('not_published')
                  : t('published_on', { date: toDatetimeString(props.row.published_at) })
              "
            >
              <q-icon name="star_outline" v-if="props.row.published_at === undefined" size="sm" />
              <q-icon
                name="star_half"
                v-else-if="isDatetimeBefore(props.row.published_at, props.row.updated_at)"
                size="sm"
              />
              <q-icon name="star" v-else size="sm" />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-state="props">
          <q-td :props="props">
            <entity-state-btn
              :entity="props.row"
              type="natural-resource"
              @state-changed="onRefresh"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-assigned_to="props">
          <q-td :props="props">
            <entity-assignee-btn
              :entity="props.row"
              type="natural-resource"
              @assignee-changed="onRefresh"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <entity-actions-btn :entity="props.row" @action="onAction(props.row, $event)" />
          </q-td>
        </template>
      </q-table>

      <resource-dialog
        v-if="selected"
        v-model="showEditDialog"
        :item="selected"
        @saved="onRefresh"
      ></resource-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import type { Option, Query } from 'src/components/models';
import type { NaturalResource } from 'src/models';
import ResourceDialog from 'src/components/ResourceDialog.vue';
import TaxonomySelect from 'src/components/TaxonomySelect.vue';
import { makePaginationRequestHandler } from 'src/utils/pagination';
import type { PaginationOptions } from 'src/utils/pagination';
import { toDatetimeString, isDatetimeBefore } from 'src/utils/time';
import { notifyError, notifySuccess } from 'src/utils/notify';
import type { Alignment } from 'src/components/models';
import EntityActionsBtn from 'src/components/EntityActionsBtn.vue';
import EntityStateBtn from 'src/components/EntityStateBtn.vue';
import EntityAssigneeBtn from 'src/components/EntityAssigneeBtn.vue';

const { t } = useI18n({ useScope: 'global' });
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
      align: 'left' as Alignment,
      field: 'id',
      style: 'width: 20px',
      sortable: true,
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
      name: 'published',
      required: true,
      label: t('published'),
      align: 'left' as Alignment,
      field: 'published_at',
      sortable: false,
      style: 'width: 50px',
    },
    {
      name: 'state',
      required: true,
      label: t('state'),
      align: 'left' as Alignment,
      field: 'state',
      sortable: true,
      style: 'min-width: 120px',
    },
    {
      name: 'assigned_to',
      required: true,
      label: t('assigned_to'),
      align: 'left' as Alignment,
      field: 'assigned_to',
      sortable: true,
    },
    {
      name: 'type',
      required: true,
      label: t('type'),
      align: 'left' as Alignment,
      field: 'type',
      format: getTypeLabel,
      sortable: true,
    },
    {
      name: 'createdBy',
      required: true,
      label: t('created_by'),
      align: 'left' as Alignment,
      field: 'created_by',
      sortable: true,
    },
    {
      name: 'lastModification',
      required: true,
      label: t('last_modification'),
      align: 'left' as Alignment,
      field: 'updated_at',
      format: toDatetimeString,
      sortable: false,
    },
  ];

  if (authStore.isAdmin || authStore.isReviewer || authStore.isContributor) {
    cols.splice(2, 0, {
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
  rowsPerPage: 50,
});
const naturalResourcesTypes = ref<Option[]>([]);

onMounted(() => {
  onRefresh();
  void taxonomyStore.getTaxonomyNode('natural-resource', 'type').then((types) => {
    if (!types) {
      console.warn('No taxonomy found for natural-resource type');
      return;
    }
    naturalResourcesTypes.value = taxonomyStore.asOptions('natural-resource', types, 'type');
  });
});

function fetchFromServer(
  startRow: number,
  count: number,
  sortBy: string,
  descending: boolean,
  filter?: string,
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

function onIndex() {
  loading.value = true;
  void service
    .index()
    .then((result) => {
      notifySuccess(t('all_items_indexed', { count: result }));
      onRefresh();
    })
    .catch(notifyError)
    .finally(() => {
      loading.value = false;
    });
}

function onAdd() {
  selected.value = { name: '', type: '' };
  showEditDialog.value = true;
}

function onRefresh() {
  tableRef.value.requestServerInteraction();
}

function onAction(item: NaturalResource, action: string) {
  switch (action) {
    case 'edit':
      onEdit(item);
      break;
    case 'publish':
      onPublish(item);
      break;
    case 'unpublish':
      onUnpublish(item);
      break;
    case 'remove':
      onRemove(item);
      break;
    case 'lock':
      onToggleLock(item);
      break;
    default:
      console.warn(`Unknown action: ${action}`);
  }
}

function onEdit(item: NaturalResource) {
  selected.value = { ...item };
  showEditDialog.value = true;
}

function onPublish(item: NaturalResource) {
  if (!item.id) return;
  void service.publish(item.id).then(onRefresh).catch(notifyError);
}

function onUnpublish(item: NaturalResource) {
  if (!item.id) return;
  void service.unpublish(item.id).then(onRefresh).catch(notifyError);
}

function onToggleLock(item: NaturalResource) {
  if (!item.id) return;
  void service
    .setState(item.id, item.state === 'locked' ? 'draft' : 'locked')
    .then(onRefresh)
    .catch(notifyError);
}

function onRemove(item: NaturalResource) {
  if (!item.id) return;
  void service.remove(item.id).then(onRefresh).catch(notifyError);
}

function getTypeLabel(val: string): string {
  return naturalResourcesTypes.value.find((opt) => opt.value === val)?.label || val;
}
</script>
