<template>
  <q-dialog v-model="showDialog" persistent @hide="onHide">
    <q-card class="dialog-xl">
      <q-card-actions>
        <div class="text-h6 q-ml-sm">{{ t(editMode ? 'edit' : 'add') }}</div>
        <q-space />
        <q-btn flat icon="close" color="primary" v-close-popup />
      </q-card-actions>
      <q-separator />

      <q-card-section>
        <q-tabs v-model="tab" dense align="left" no-caps>
          <q-tab name="general" :label="t('general') + ' *'" />
          <q-tab name="physical_characteristics" :label="t('physical_characteristics')" />
          <q-tab name="multimedia" :label="t('multimedia')" />
          <q-tab name="relations" :label="t('relations')" />
        </q-tabs>
        <q-separator />

        <q-tab-panels v-model="tab">
          <q-tab-panel name="general" class="q-pl-none q-pr-none">
            <div class="row q-mb-md q-col-gutter-md">
              <div class="col-12 col-sm-4">
                <q-input filled v-model="selected.name" :label="t('name') + ' *'" />
              </div>
              <div class="col-12 col-sm-4">
                <taxonomy-select
                  v-model="selected.types"
                  entity-type="building-material"
                  path="type"
                  multiple
                  :label="t('types') + ' *'"
                />
              </div>
              <div class="col-12 col-sm-4">
                <taxonomy-select
                  v-model="selected.materials"
                  entity-type="natural-resource"
                  path="type"
                  multiple
                  :label="t('materials')"
                />
              </div>
            </div>
            <text-input
              v-model="selected.description"
              :label="t('description')"
              help="building-material-description"
              class="q-mb-md"
            />
            <text-input
              v-model="selected.article_top"
              :label="t('article_top')"
              help="building-material-article-top"
              class="q-mb-md"
            />
            <text-input
              v-model="selected.article_bottom"
              :label="t('article_bottom')"
              help="building-material-article-bottom"
              class="q-mb-md"
            />
            <text-input
              v-model="selected.side_note"
              :label="t('side_note')"
              help="building-material-side-note"
              class="q-mb-md"
            />
            <text-input
              v-model="selected.external_links"
              :label="t('external_links')"
              help="building-material-links"
              class="q-mb-md"
            />
          </q-tab-panel>
          <q-tab-panel name="physical_characteristics" class="q-pl-none q-pr-none">
            <physical-entity-form v-model="selected" />
          </q-tab-panel>
          <q-tab-panel name="multimedia" class="q-pl-none q-pr-none">
            <files-input v-if="selected.files" v-model="selected.files" />
          </q-tab-panel>
          <q-tab-panel name="relations" class="q-pl-none q-pr-none">
            <q-select
              filled
              v-model="naturalResources"
              :options="naturalResourcesOptions"
              multiple
              map-options
              emit-value
              use-chips
              :label="t('natural_resources')"
              :hint="t('building_material_constituants_hint')"
              class="q-mb-md"
            />
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="bg-grey-3">
        <q-btn flat :label="t('cancel')" color="secondary" @click="onCancel" v-close-popup />
        <q-btn :label="t('save')" color="primary" @click="onSave" :disable="!isValid" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { BuildingMaterial, NaturalResource } from 'src/models';
import { notifyError } from 'src/utils/notify';
import PhysicalEntityForm from 'src/components/PhysicalEntityForm.vue';
import FilesInput from 'src/components/FilesInput.vue';
import TaxonomySelect from 'src/components/TaxonomySelect.vue';
import TextInput from 'src/components/TextInput.vue';

interface DialogProps {
  modelValue: boolean;
  item: BuildingMaterial;
}

const props = defineProps<DialogProps>();
const emit = defineEmits(['update:modelValue', 'saved']);

const { t } = useI18n();
const filesStore = useFilesStore();
const services = useServices();
const service = services.make('building-material');
const nrService = services.make('natural-resource');

const showDialog = ref(props.modelValue);
const selected = ref<BuildingMaterial>({
  name: '',
  files: [],
  type: '',
} as BuildingMaterial);
const editMode = ref(false);
const tab = ref('general');
const naturalResources = ref<number[]>([]);
const naturalResourcesOptions = ref<
  {
    label: string | undefined;
    value: number | undefined;
  }[]
>([]);

const isValid = computed(() => {
  return selected.value.name && selected.value.types;
});

onMounted(() => {
  init(props.modelValue);
});

watch(
  () => props.modelValue,
  (value) => init(value),
  { immediate: true },
);

function init(value: boolean) {
  tab.value = 'general';
  if (value) {
    // deep copy
    selected.value = JSON.parse(JSON.stringify(props.item));
    editMode.value = selected.value.id !== undefined;
    tab.value = 'general';
    naturalResources.value = [];
    void nrService
      .find({
        $limit: 100,
        $select: ['id', 'name', 'type'],
        filter: {},
      })
      .then((res) => {
        naturalResourcesOptions.value = res.data.map((item: NaturalResource) => ({
          label: item.name,
          value: item.id,
        }));
      });
    if (editMode.value) {
      naturalResources.value =
        selected.value.natural_resources?.map((item: NaturalResource) => item.id || 0) || [];
    }
  }
  if (selected.value.files === undefined) {
    selected.value.files = [];
  }
  showDialog.value = value;
}

function onHide() {
  showDialog.value = false;
  emit('update:modelValue', false);
}

function onCancel() {
  filesStore.clearFilesToDelete();
}

function onSave() {
  if (selected.value === undefined) return;
  delete selected.value.natural_resources;
  selected.value.natural_resource_ids = naturalResources.value;
  if (selected.value.id) {
    service
      .update(selected.value.id, selected.value)
      .then(() => {
        void filesStore.deleteFiles();
        emit('saved', selected.value);
        onHide();
      })
      .catch((err) => {
        notifyError(err.message);
      });
  } else {
    service
      .create(selected.value)
      .then(() => {
        void filesStore.deleteFiles();
        emit('saved', selected.value);
        onHide();
      })
      .catch((err) => {
        notifyError(err.message);
      });
  }
}
</script>
