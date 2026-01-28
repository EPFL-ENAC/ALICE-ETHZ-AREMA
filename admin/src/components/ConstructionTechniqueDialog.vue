<template>
  <q-dialog v-model="showDialog" persistent @hide="onHide">
    <q-card class="dialog-xl">
      <q-card-actions>
        <div class="text-h6 q-ml-sm">{{ t(readOnly ? 'view' : editMode ? 'edit' : 'add') }}</div>
        <q-space />
        <q-btn flat icon="close" color="primary" v-close-popup />
      </q-card-actions>
      <q-separator />

      <q-card-section>
        <q-tabs v-model="tab" dense align="left" no-caps>
          <q-tab name="general" :label="t('general') + ' *'" />
          <q-tab name="multimedia" :label="t('multimedia') + ' *'" />
          <q-tab name="relations" :label="t('relations')" />
        </q-tabs>
        <q-separator />

        <q-tab-panels v-model="tab">
          <q-tab-panel name="general" class="q-pl-none q-pr-none">
            <div class="row q-mb-md q-col-gutter-md">
              <div class="col-12 col-sm-4">
                <q-input
                  :disable="readOnly"
                  filled
                  v-model="selected.name"
                  :label="t('name') + ' *'"
                />
              </div>
              <div class="col-12 col-sm-4">
                <taxonomy-select
                  :disable="readOnly"
                  v-model="selected.types"
                  entity-type="technical-construction"
                  path="type"
                  multiple
                  :label="t('types') + ' *'"
                />
              </div>
              <div class="col-12 col-sm-4">
                <taxonomy-select
                  :disable="readOnly"
                  v-model="selected.materials"
                  entity-type="natural-resource"
                  path="type"
                  multiple
                  :label="t('materials')"
                />
              </div>
            </div>
            <text-input
              :disable="readOnly"
              v-model="selected.description"
              :label="t('description')"
              help="technical-construction-description"
              class="q-mb-md"
            />
            <text-input
              :disable="readOnly"
              v-model="selected.article_top"
              :label="t('article_top')"
              help="technical-construction-article-top"
              class="q-mb-md"
            />
            <text-input
              :disable="readOnly"
              v-model="selected.article_bottom"
              :label="t('article_bottom')"
              help="technical-construction-article-bottom"
              class="q-mb-md"
            />
            <text-input
              :disable="readOnly"
              v-model="selected.side_note"
              :label="t('side_note')"
              help="technical-construction-side-note"
              class="q-mb-md"
            />
            <text-input
              :disable="readOnly"
              v-model="selected.external_links"
              :label="t('external_links')"
              help="technical-construction-links"
              class="q-mb-md"
            />
          </q-tab-panel>
          <q-tab-panel name="multimedia" class="q-pl-none q-pr-none">
            <files-input :disable="readOnly" v-if="selected.files" v-model="selected.files" />
          </q-tab-panel>
          <q-tab-panel name="relations" class="q-pl-none q-pr-none">
            <q-select
              :disable="readOnly"
              filled
              v-model="buildingMaterials"
              :options="buildingMaterialsOptions"
              multiple
              map-options
              emit-value
              use-chips
              :label="t('building_materials')"
              :hint="t('technical_construction_building_material_constituants_hint')"
              class="q-mb-md"
            />
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="bg-grey-3">
        <q-btn
          v-if="readOnly"
          flat
          :label="t('close')"
          color="secondary"
          @click="onCancel"
          v-close-popup
        />
        <q-btn
          v-if="!readOnly"
          flat
          :label="t('cancel')"
          color="secondary"
          @click="onCancel"
          :disable="saving"
          v-close-popup
        />
        <q-btn
          v-if="!readOnly"
          :label="t('save')"
          color="primary"
          @click="onSave"
          :disable="!isValid || saving"
          :loading="saving"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { BuildingMaterial, TechnicalConstruction } from 'src/models';
import { notifyError } from 'src/utils/notify';
import FilesInput from 'src/components/FilesInput.vue';
import TaxonomySelect from 'src/components/TaxonomySelect.vue';
import TextInput from 'src/components/TextInput.vue';

interface DialogProps {
  modelValue: boolean;
  item: TechnicalConstruction;
  readOnly?: boolean;
}

const props = defineProps<DialogProps>();
const emit = defineEmits(['update:modelValue', 'saved']);

const { t } = useI18n();
const filesStore = useFilesStore();
const services = useServices();
const service = services.make('technical-construction');
const bmService = services.make('building-material');

const showDialog = ref(props.modelValue);
const selected = ref<TechnicalConstruction>({
  name: '',
  files: [],
  type: '',
} as TechnicalConstruction);
const editMode = ref(false);
const tab = ref('general');
const buildingMaterials = ref<number[]>([]);
const buildingMaterialsOptions = ref<{ label: string | undefined; value: number | undefined }[]>(
  [],
);
const saving = ref(false);

const isValid = computed(() => {
  return (
    selected.value.name &&
    selected.value.types &&
    selected.value.files !== undefined &&
    selected.value.files.length >= 1
  );
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
    buildingMaterials.value = [];
    void bmService
      .find({
        $limit: 100,
        $select: ['id', 'name', 'types'],
        filter: {},
      })
      .then((res) => {
        buildingMaterialsOptions.value = res.data.map((item: BuildingMaterial) => ({
          label: item.name,
          value: item.id,
        }));
      });
    if (editMode.value) {
      buildingMaterials.value =
        selected.value.building_materials?.map((item: BuildingMaterial) => item.id || 0) || [];
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
  delete selected.value.building_materials;
  selected.value.building_material_ids = buildingMaterials.value;
  saving.value = true;
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
      })
      .finally(() => {
        saving.value = false;
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
      })
      .finally(() => {
        saving.value = false;
      });
  }
}
</script>
