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
          <q-tab name="location" :label="t('location') + ' *'" />
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
                  entity-type="professional"
                  path="type"
                  :label="t('types') + ' *'"
                  multiple
                />
              </div>
              <div class="col-12 col-sm-4">
                <taxonomy-select
                  :disable="readOnly"
                  v-model="selected.materials"
                  entity-type="natural-resource"
                  path="type"
                  :label="t('materials')"
                  multiple
                />
              </div>
            </div>
            <text-input
              :disable="readOnly"
              v-model="selected.description"
              :label="t('description')"
              help="professional-description"
              class="q-mb-md"
            />
            <div class="row q-mb-md q-col-gutter-md">
              <div class="col-12 col-sm-4">
                <q-input :disable="readOnly" filled v-model="selected.tel" :label="t('phone')" />
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  :disable="readOnly"
                  filled
                  v-model="selected.email"
                  type="email"
                  :label="t('email')"
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input :disable="readOnly" filled v-model="selected.web" :label="t('website')" />
              </div>
            </div>
            <text-input
              :disable="readOnly"
              v-model="selected.article_top"
              :label="t('article_top')"
              help="professional-article-top"
              class="q-mb-md"
            />
            <text-input
              :disable="readOnly"
              v-model="selected.article_bottom"
              :label="t('article_bottom')"
              help="professional-article-bottom"
              class="q-mb-md"
            />
            <text-input
              :disable="readOnly"
              v-model="selected.side_note"
              :label="t('side_note')"
              help="professional-side-note"
              class="q-mb-md"
            />
            <text-input
              :disable="readOnly"
              v-model="selected.external_links"
              :label="t('external_links')"
              help="professional-links"
              class="q-mb-md"
            />
          </q-tab-panel>
          <q-tab-panel name="location" class="q-pl-none q-pr-none">
            <circle-map-input
              :disable="readOnly"
              v-model="circle"
              height="400px"
              @update:model-value="onCircleInputUpdated"
            ></circle-map-input>
            <div class="text-bold q-mt-md">{{ t('other_addresses') }}</div>
            <q-list class="q-mb-sm">
              <q-item v-for="(address, index) in selected.addresses" :key="index" class="q-pa-none">
                <q-item-section>
                  <address-input
                    :disable="readOnly"
                    v-if="selected.addresses && selected.addresses[index]"
                    v-model="selected.addresses[index]"
                    :label="t('address')"
                  />
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    v-show="!readOnly"
                    flat
                    size="sm"
                    icon="delete"
                    @click="onDeleteAddress(index)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
            <div v-if="selected.addresses?.length" class="text-hint q-mb-sm">
              {{ t('address_input_hint') }}
            </div>
            <q-btn v-show="!readOnly" color="primary" icon="add" @click="onAddAddress" size="sm" />
          </q-tab-panel>
          <q-tab-panel name="multimedia" class="q-pl-none q-pr-none">
            <files-input v-if="selected.files" :disable="readOnly" v-model="selected.files" />
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
              :hint="t('professional_building_material_expertise_hint')"
              class="q-mb-md"
            />
            <q-select
              :disable="readOnly"
              filled
              v-model="technicalConstructions"
              :options="technicalConstructionsOptions"
              multiple
              map-options
              emit-value
              use-chips
              :label="t('technical_constructions')"
              :hint="t('professional_technical_construction_expertise_hint')"
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
          v-close-popup
        />
        <q-btn
          v-if="!readOnly"
          :label="t('save')"
          color="primary"
          @click="onSave"
          :disable="!isValid"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { BuildingMaterial, Professional, TechnicalConstruction } from 'src/models';
import { notifyError } from 'src/utils/notify';
import CircleMapInput from 'src/components/CircleMapInput.vue';
import FilesInput from 'src/components/FilesInput.vue';
import TaxonomySelect from 'src/components/TaxonomySelect.vue';
import TextInput from 'src/components/TextInput.vue';
import AddressInput from 'src/components/AddressInput.vue';
import type { Feature } from '@turf/turf';

interface DialogProps {
  modelValue: boolean;
  item: Professional;
  readOnly?: boolean;
}

const props = defineProps<DialogProps>();
const emit = defineEmits(['update:modelValue', 'saved']);

const { t } = useI18n();
const filesStore = useFilesStore();
const services = useServices();
const service = services.make('professional');
const bmService = services.make('building-material');
const tcService = services.make('technical-construction');

const showDialog = ref(props.modelValue);
const selected = ref<Professional>({
  name: '',
  files: [],
} as Professional);
const circle = ref<Feature>({} as Feature);
const editMode = ref(false);
const tab = ref('general');
const buildingMaterials = ref<number[]>([]);
const buildingMaterialsOptions = ref<{ label: string | undefined; value: number | undefined }[]>(
  [],
);
const technicalConstructions = ref<number[]>([]);
const technicalConstructionsOptions = ref<
  { label: string | undefined; value: number | undefined }[]
>([]);

const isValid = computed(() => {
  return (
    selected.value.name &&
    selected.value.types &&
    selected.value.address &&
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
    circle.value = {};
    if (editMode.value) {
      const center = unref([selected.value.long, selected.value.lat]);
      circle.value = {
        type: 'Feature',
        properties: {
          addressInput: selected.value.address,
          circleRadius: selected.value.radius,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[center, center, center, center]],
        },
      };
    }

    buildingMaterials.value = [];
    void bmService
      .find({
        $limit: 100,
        $select: ['id', 'name'],
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

    technicalConstructions.value = [];
    void tcService
      .find({
        $limit: 100,
        $select: ['id', 'name'],
        filter: {},
      })
      .then((res) => {
        technicalConstructionsOptions.value = res.data.map((item: TechnicalConstruction) => ({
          label: item.name,
          value: item.id,
        }));
      });
    if (editMode.value) {
      technicalConstructions.value =
        selected.value.technical_constructions?.map(
          (item: TechnicalConstruction) => item.id || 0,
        ) || [];
    }
  }
  if (selected.value.files === undefined) {
    selected.value.files = [];
  }
  if (selected.value.addresses === undefined) {
    selected.value.addresses = [];
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
  delete selected.value.technical_constructions;
  selected.value.technical_construction_ids = technicalConstructions.value;
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

function onCircleInputUpdated(newValue: Feature) {
  if (!selected.value) return;

  if (newValue && newValue.properties && newValue.geometry) {
    selected.value.address = newValue.properties.addressInput;
    selected.value.radius = newValue.properties.circleRadius;
    selected.value.long = newValue.geometry.coordinates[0][0][0];
    selected.value.lat = newValue.geometry.coordinates[0][0][1];
    if (selected.value.long && selected.value.lat)
      selected.value.geom = {
        point: [selected.value.long, selected.value.lat],
      };
    else selected.value.geom = undefined;
  } else {
    selected.value.address = undefined;
    selected.value.radius = undefined;
    selected.value.long = undefined;
    selected.value.lat = undefined;
    selected.value.geom = undefined;
  }
}

function onAddAddress() {
  if (selected.value.addresses === undefined) {
    selected.value.addresses = [];
  }
  selected.value.addresses.push('');
}

function onDeleteAddress(index: number) {
  selected.value.addresses?.splice(index, 1);
}
</script>
