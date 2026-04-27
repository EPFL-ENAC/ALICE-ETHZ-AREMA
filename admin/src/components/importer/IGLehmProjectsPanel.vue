<template>
  <div>
    <q-spinner-dots v-if="loading" color="primary" size="50px" />
    <div v-else>
      <q-toolbar class="q-mb-sm q-px-none">
        <q-chip
          :label="t('all')"
          clickable
          :class="status_filter === 'all' ? 'bg-secondary text-white' : undefined"
          @click="status_filter = 'all'"
        />
        <q-chip
          :label="t('new')"
          clickable
          :class="status_filter === 'new' ? 'bg-accent text-white' : undefined"
          class="q-ml-xs"
          @click="status_filter = 'new'"
        />
        <q-chip
          :label="t('updated')"
          clickable
          :class="status_filter === 'updated' ? 'bg-accent text-white' : undefined"
          class="q-ml-xs"
          @click="status_filter = 'updated'"
        />
        <q-space />
        <q-input dense debounce="300" v-model="filter" clearable>
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-toolbar>
      <q-scroll-area style="height: 500px">
        <q-list bordered separator v-if="filteredProjects.length" class="q-mb-md">
          <template v-for="project in filteredProjects" :key="project.cId">
            <q-item :active="selected?.cId === project.cId" active-class="bg-teal-1">
              <q-item-section clickable @click="onSelectProject(project)" avatar>
                <q-icon
                  :name="project.cId === selected?.cId ? 'check_box' : 'check_box_outline_blank'"
                />
              </q-item-section>
              <q-item-section>
                <div>
                  <a :href="project.pageUrl" target="_blank" rel="noopener noreferrer" class="epfl">
                    {{ project.title }}
                    <q-icon name="open_in_new" />
                  </a>
                </div>
                <div v-if="!project.building_id">
                  <q-badge color="primary" :label="t('new')" />
                </div>
              </q-item-section>
              <q-item-section avatar v-if="project.previewImage">
                <q-img :src="project.previewImage" width="100px" fit="scale-down" />
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type IGLehmProjectSummary } from 'src/models';
import { notifyError } from 'src/utils/notify';

const emit = defineEmits(['update:modelValue']);

const { t } = useI18n();
const importerService = useImporterService();

const loading = ref(false);
const projects = ref<IGLehmProjectSummary[]>([]);
const status_filter = ref<'all' | 'new' | 'updated'>('all');
const filter = ref('');
const selected = ref<IGLehmProjectSummary | null>(null);

const filteredProjects = computed(() => {
  const lowerFilter = filter.value?.toLowerCase();
  return projects.value
    .filter((project) => (lowerFilter ? project.title.toLowerCase().includes(lowerFilter) : true))
    .filter((project) => {
      if (status_filter.value === 'all') {
        return true;
      }
      if (status_filter.value === 'new') {
        return !project.building_id;
      }
      if (status_filter.value === 'updated') {
        return project.building_id;
      }
      return true;
    });
});

onMounted(() => {
  void onFetchIGLehmProjects();
});

function onFetchIGLehmProjects() {
  // fetch IG Lehm projects from https://www.iglehm.ch/ccm/api/v1/projects
  // accept json
  loading.value = true;
  void importerService
    .fetchIGLehmProjects()
    .then((data: IGLehmProjectSummary[]) => {
      projects.value = data.sort((a, b) => a.title.localeCompare(b.title));
    })
    .catch(notifyError)
    .finally(() => {
      loading.value = false;
    });
}

function onSelectProject(project: IGLehmProjectSummary) {
  if (selected.value?.cId === project.cId) {
    selected.value = null;
    emit('update:modelValue', null);
    return;
  }
  selected.value = project;
  if (selected.value) {
    emit('update:modelValue', selected.value);
  }
}
</script>
