<template>
  <div class="row items-center q-gutter-sm">
    <q-toggle v-model="mine" dense :label="t('added_by_me')" />
    <q-toggle v-model="assigned" dense :label="t('assigned_to_me')" class="q-mr-md" />
    <q-select
      v-model="states"
      :options="stateOptions"
      :label="t('state')"
      :placeholder="states.length ? '' : t('all_states')"
      multiple
      emit-value
      map-options
      use-chips
      dense
      clearable
      style="min-width: 200px"
    />
    <q-select
      v-model="authors"
      :options="authorOptions"
      :label="t('authors')"
      multiple
      emit-value
      map-options
      use-chips
      dense
      clearable
      style="min-width: 200px"
    />
    <q-select
      v-model="affiliations"
      :options="affiliationOptions"
      :label="t('affiliation')"
      multiple
      use-chips
      dense
      clearable
      style="min-width: 200px"
    />
  </div>
</template>

<script setup lang="ts">
import type { Filter, Option } from '@/components/models';
import type { SubjectProfile } from '@/models';
import { notifyError } from '@/utils/notify';

const model = defineModel<Filter[]>({ default: () => [] });

const { t } = useI18n();
const authStore = useAuthStore();
const services = useServices();

const STATES = ['draft', 'in-review', 'to-publish', 'to-unpublish', 'to-delete', 'locked'];

const mine = ref(false);
const assigned = ref(false);
const states = ref<string[]>([]);
const authors = ref<string[]>([]);
const affiliations = ref<string[]>([]);
const profiles = ref<SubjectProfile[]>([]);

const stateOptions = computed<Option[]>(() =>
  STATES.map((s) => ({ value: s, label: t(`states.${s}`) })),
);
const authorOptions = computed<Option[]>(() =>
  profiles.value.map((p) => ({ value: profileRef(p), label: p.name })),
);
const affiliationOptions = computed<string[]>(() =>
  [...new Set(profiles.value.map((p) => p.affiliation).filter((a): a is string => !!a))].sort(),
);

onMounted(() => {
  // same author candidates as AuthorsInput: published profiles only
  void services
    .make('subject-profile')
    .find({
      $skip: 0,
      $limit: 1000,
      $sort: ['name', false],
      filter: { published_at: { $exists: true } },
    })
    .then((response) => {
      profiles.value = response.data;
    })
    .catch(() => notifyError(t('error_loading_authors')));
});

function profileRef(p: SubjectProfile) {
  return `${p.type}:${p.identifier}`;
}

function anyAuthor(refs: string[]): Filter {
  // an impossible ref keeps the clause restrictive when nothing matches
  return { $or: (refs.length ? refs : ['']).map((r) => ({ authors: { $contains: [r] } })) };
}

// clauses to be AND-ed with the page's own query filter
const clauses = computed<Filter[]>(() => {
  const username = authStore.profile?.username || authStore.profile?.email || '';
  const res: Filter[] = [];
  if (mine.value) res.push({ created_by: { $eq: username } });
  // ponytail: assigned_to is a ", " joined list of usernames, so substring match; a user
  // whose name contains another's would also match
  if (assigned.value) res.push({ assigned_to: { $ilike: username } });
  if (states.value?.length) res.push({ state: { $in: states.value } });
  if (authors.value?.length) res.push(anyAuthor(authors.value));
  if (affiliations.value?.length) {
    res.push(
      anyAuthor(
        profiles.value
          .filter((p) => p.affiliation && affiliations.value.includes(p.affiliation))
          .map(profileRef),
      ),
    );
  }
  return res;
});

watch(clauses, (val) => (model.value = val));
</script>
