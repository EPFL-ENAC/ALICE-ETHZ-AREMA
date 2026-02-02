<template>
  <q-page>
    <div class="text-h5 q-pa-md">{{ t('authors') }}</div>
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
            v-if="authStore.isAdmin"
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
            :label="t('sync_from_users')"
            icon="people"
            @click="onSyncFromUsers"
            class="on-right"
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
            <entity-actions-btn :entity="props.row" @action="onAction(props.row, $event)" />
          </q-td>
        </template>
      </q-table>

      <subject-profile-dialog
        v-if="selected"
        v-model="showEditDialog"
        :item="selected"
        :read-only="readOnly"
        @saved="onRefresh"
      ></subject-profile-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import type { Query } from 'src/components/models';
import type { SubjectProfile } from 'src/models';
import SubjectProfileDialog from 'src/components/SubjectProfileDialog.vue';
import { makePaginationRequestHandler } from 'src/utils/pagination';
import type { PaginationOptions } from 'src/utils/pagination';
import { toDatetimeString } from 'src/utils/time';
import { notifyError, notifySuccess } from 'src/utils/notify';
import type { Alignment } from 'src/components/models';
import EntityActionsBtn from 'src/components/EntityActionsBtn.vue';

const { t } = useI18n({ useScope: 'global' });
const authStore = useAuthStore();
const usersStore = useUsersStore();
const services = useServices();
const service = services.make('subject-profile');

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
      label: t('profile.name'),
      align: 'left' as Alignment,
      field: 'name',
      sortable: true,
    },
    {
      name: 'type',
      required: true,
      label: t('profile.type'),
      align: 'left' as Alignment,
      field: 'type',
      sortable: true,
    },
    {
      name: 'affiliation',
      label: t('profile.affiliation'),
      align: 'left' as Alignment,
      field: 'affiliation',
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

  if (authStore.isAdmin) {
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

const selected = ref<SubjectProfile>();
const showEditDialog = ref(false);
const readOnly = ref(false);
const tableRef = ref();
const rows = ref<SubjectProfile[]>([]);
const types = ref<string[] | null>(null);
const filter = ref('');
const loading = ref(false);
const pagination = ref<PaginationOptions>({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 50,
});

onMounted(() => {
  onRefresh();
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
  selected.value = { identifier: '', type: 'user', name: '' };
  showEditDialog.value = true;
}

function onSyncFromUsers() {
  loading.value = true;
  usersStore
    .init()
    .then(async () => {
      await Promise.all(
        usersStore.users.map(async (user) => {
          try {
            const author: SubjectProfile = {
              name: `${user.first_name ?? ''} ${user.first_name?.endsWith(user.last_name || '') ? '' : user.last_name}`.trim(),
              type: 'user',
              identifier: user.username?.toString() || user.id?.toString() || '',
            };
            await service.create(author);
          } catch (e) {
            console.error(`Could not create author for user ${user.id}:`, e);
          }
        }),
      );
    })
    .then(() => {
      notifySuccess(t('authors_synced_from_users', { count: usersStore.users.length }));
      onRefresh();
    })
    .catch(notifyError)
    .finally(() => {
      loading.value = false;
    });
}

function onRefresh() {
  tableRef.value.requestServerInteraction();
}

function onAction(item: SubjectProfile, action: string) {
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
    default:
      console.warn(`Unknown action: ${action}`);
  }
}

function onEdit(item: SubjectProfile) {
  selected.value = { ...item };
  readOnly.value = false;
  showEditDialog.value = true;
}

function onPublish(item: SubjectProfile) {
  if (!item.id) return;
  void service.publish(item.id).then(onRefresh).catch(notifyError);
}

function onUnpublish(item: SubjectProfile) {
  if (!item.id) return;
  void service.unpublish(item.id).then(onRefresh).catch(notifyError);
}

function onRemove(item: SubjectProfile) {
  if (!item.id) return;
  void service.remove(item.id).then(onRefresh).catch(notifyError);
}
</script>
