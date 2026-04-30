<template>
  <div>
    <q-spinner-dots v-if="loading" color="primary" size="50px" />
    <div v-else>
      <q-toolbar class="q-mb-sm q-px-none">
        <q-chip
          :label="t('importer.all')"
          clickable
          :class="status_filter === 'all' ? 'bg-secondary text-white' : undefined"
          @click="status_filter = 'all'"
        />
        <q-chip
          :label="t('importer.new')"
          clickable
          :class="status_filter === 'new' ? 'bg-accent text-white' : undefined"
          class="q-ml-xs"
          @click="status_filter = 'new'"
        />
        <q-chip
          :label="t('importer.update')"
          clickable
          :class="status_filter === 'update' ? 'bg-accent text-white' : undefined"
          class="q-ml-xs"
          @click="status_filter = 'update'"
        />
        <q-space />
        <q-input dense debounce="300" v-model="filter" clearable>
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-toolbar>
      <q-scroll-area style="height: 500px">
        <q-list bordered separator v-if="filteredSpecialists.length" class="q-mb-md">
          <template v-for="specialist in filteredSpecialists" :key="specialist.cId">
            <q-item :active="selected?.cId === specialist.cId" active-class="bg-teal-1">
              <q-item-section clickable @click="onSelectSpecialist(specialist)" avatar>
                <q-icon
                  :name="specialist.cId === selected?.cId ? 'check_box' : 'check_box_outline_blank'"
                />
              </q-item-section>
              <q-item-section>
                <div>
                  <a
                    :href="specialist.pageUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="epfl"
                  >
                    {{ specialist.title }}
                    <q-icon name="open_in_new" />
                  </a>
                </div>
                <div v-if="!specialist.professional_id">
                  <q-badge color="primary" :label="t('importer.new')" />
                </div>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type IGLehmSpecialistSummary } from 'src/models';
import { notifyError } from 'src/utils/notify';

const emit = defineEmits(['update:modelValue']);

const { t } = useI18n();
const importerService = useImporterService();

const loading = ref(false);
const specialists = ref<IGLehmSpecialistSummary[]>([]);
const status_filter = ref<'all' | 'new' | 'update'>('all');
const filter = ref('');
const selected = ref<IGLehmSpecialistSummary | null>(null);

const filteredSpecialists = computed(() => {
  const lowerFilter = filter.value?.toLowerCase();
  return specialists.value
    .filter((specialist) =>
      lowerFilter ? specialist.title.toLowerCase().includes(lowerFilter) : true,
    )
    .filter((specialist) => {
      if (status_filter.value === 'all') {
        return true;
      }
      if (status_filter.value === 'new') {
        return !specialist.professional_id;
      }
      if (status_filter.value === 'update') {
        return specialist.professional_id;
      }
      return true;
    });
});

onMounted(() => {
  void onFetchIGLehmSpecialists();
});

function onFetchIGLehmSpecialists() {
  // fetch IG Lehm specialists from https://www.iglehm.ch/ccm/api/v1/specialists
  // accept json
  loading.value = true;
  void importerService
    .fetchIGLehmSpecialists()
    .then((data: IGLehmSpecialistSummary[]) => {
      specialists.value = data.sort((a, b) => a.title.localeCompare(b.title));
    })
    .catch(notifyError)
    .finally(() => {
      loading.value = false;
    });
}

function onSelectSpecialist(specialist: IGLehmSpecialistSummary) {
  if (selected.value?.cId === specialist.cId) {
    selected.value = null;
    emit('update:modelValue', null);
    return;
  }
  selected.value = specialist;
  if (selected.value) {
    emit('update:modelValue', selected.value);
  }
}
</script>
