<template>
  <q-dialog v-model="showDialog" persistent @hide="onHide">
    <q-card class="dialog-lg">
      <q-card-actions>
        <div class="text-h6 q-ml-sm">{{ $t(editMode ? 'edit' : 'add') }}</div>
        <q-space />
        <q-btn flat icon="close" color="primary" v-close-popup />
      </q-card-actions>
      <q-separator />

      <q-card-section>
        <q-tabs v-model="tab" dense align="left" no-caps>
          <q-tab name="general" :label="$t('general')" />
          <q-tab name="location" :label="$t('location')" />
          <q-tab name="multimedia" :label="$t('multimedia')" />
          <q-tab name="relations" :label="$t('relations')" />
        </q-tabs>
        <q-separator />

        <q-tab-panels v-model="tab">
          <q-tab-panel name="general" class="q-pl-none q-pr-none">
            <div class="row q-mb-md q-col-gutter-md">
              <div class="col-12 col-sm-4">
                <q-input
                  filled
                  v-model="selected.name"
                  :label="$t('name') + ' *'"
                />
              </div>
              <div class="col-12 col-sm-4">
                <taxonomy-select
                  v-model="selected.types"
                  entity-type="professional"
                  path="type"
                  :label="$t('type') + ' *'"
                  multiple
                />
              </div>
              <div class="col-12 col-sm-4">
                <taxonomy-select
                  v-model="selected.materials"
                  entity-type="natural-resource"
                  path="type"
                  :label="$t('materials')"
                  multiple
                />
              </div>
            </div>
            <q-input
              filled
              v-model="selected.description"
              autogrow
              :label="$t('description')"
              class="q-mb-md"
            />
            <div class="row q-mb-md q-col-gutter-md">
              <div class="col-12 col-sm-4">
                <q-input filled v-model="selected.tel" :label="$t('phone')" />
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  filled
                  v-model="selected.email"
                  type="email"
                  :label="$t('email')"
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input filled v-model="selected.web" :label="$t('website')" />
              </div>
            </div>
            <q-input
              filled
              v-model="selected.article_top"
              type="textarea"
              :label="$t('article_top')"
              class="q-mb-md"
            />
            <q-input
              filled
              v-model="selected.article_bottom"
              type="textarea"
              :label="$t('article_bottom')"
              class="q-mb-md"
            />
            <q-input
              filled
              v-model="selected.side_note"
              type="textarea"
              :label="$t('side_note')"
              class="q-mb-md"
            />
            <q-input
              filled
              v-model="selected.external_links"
              type="textarea"
              :label="$t('external_links')"
              class="q-mb-md"
            />
          </q-tab-panel>
          <q-tab-panel name="location" class="q-pl-none q-pr-none">
            <circle-map-input
              v-model="circle"
              height="400px"
              @update:model-value="onCircleInputUpdated"
            ></circle-map-input>
          </q-tab-panel>
          <q-tab-panel name="multimedia" class="q-pl-none q-pr-none">
            <files-input v-model="selected.files" />
          </q-tab-panel>
          <q-tab-panel name="relations" class="q-pl-none q-pr-none">
            <q-select
              filled
              v-model="buildingMaterials"
              :options="buildingMaterialsOptions"
              multiple
              map-options
              emit-value
              use-chips
              :label="$t('building_materials')"
              :hint="$t('professional_building_material_expertise_hint')"
              class="q-mb-md"
            />
            <q-select
              filled
              v-model="technicalConstructions"
              :options="technicalConstructionsOptions"
              multiple
              map-options
              emit-value
              use-chips
              :label="$t('technical_constructions')"
              :hint="$t('professional_technical_construction_expertise_hint')"
              class="q-mb-md"
            />
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="bg-grey-3">
        <q-btn
          flat
          :label="$t('cancel')"
          color="secondary"
          @click="onCancel"
          v-close-popup
        />
        <q-btn
          :label="$t('save')"
          color="primary"
          @click="onSave"
          :disable="!isValid"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
export default defineComponent({
  name: 'ProfessionalDialog',
});
</script>
<script setup lang="ts">
import {
  BuildingMaterial,
  Professional,
  TechnicalConstruction,
} from 'src/models';
import { notifyError } from 'src/utils/notify';
import CircleMapInput from 'src/components/CircleMapInput.vue';
import FilesInput from 'src/components/FilesInput.vue';
import TaxonomySelect from 'src/components/TaxonomySelect.vue';

interface DialogProps {
  modelValue: boolean;
  item: Professional;
}

const props = defineProps<DialogProps>();
const emit = defineEmits(['update:modelValue', 'saved']);

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
const circle = ref({});
const editMode = ref(false);
const tab = ref('general');
const buildingMaterials = ref([]);
const buildingMaterialsOptions = ref<
  { label: string | undefined; value: number | undefined }[]
>([]);
const technicalConstructions = ref([]);
const technicalConstructionsOptions = ref<
  { label: string | undefined; value: number | undefined }[]
>([]);

const isValid = computed(() => {
  return selected.value.name && selected.value.types && selected.value.address;
});

watch(
  () => props.modelValue,
  (value) => {
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
            display_name: selected.value.address,
            circleRadius: selected.value.radius,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[center, center, center, center]],
          },
        };
      }

      buildingMaterials.value = [];
      bmService
        .find({
          $limit: 100,
          $select: ['id', 'name'],
          filter: {},
        })
        .then((res) => {
          buildingMaterialsOptions.value = res.data.map(
            (item: BuildingMaterial) => ({
              label: item.name,
              value: item.id,
            }),
          );
        });
      if (editMode.value) {
        buildingMaterials.value = selected.value.building_materials
          ? selected.value.building_materials.map(
              (item: BuildingMaterial) => item.id,
            )
          : [];
      }

      technicalConstructions.value = [];
      tcService
        .find({
          $limit: 100,
          $select: ['id', 'name'],
          filter: {},
        })
        .then((res) => {
          technicalConstructionsOptions.value = res.data.map(
            (item: TechnicalConstruction) => ({
              label: item.name,
              value: item.id,
            }),
          );
        });
      if (editMode.value) {
        technicalConstructions.value = selected.value.technical_constructions
          ? selected.value.technical_constructions.map(
              (item: TechnicalConstruction) => item.id,
            )
          : [];
      }
    }
    if (selected.value.files === undefined) {
      selected.value.files = [];
    }
    showDialog.value = value;
  },
);

function onHide() {
  showDialog.value = false;
  emit('update:modelValue', false);
}

function onCancel() {
  filesStore.clearFilesToDelete();
}

async function onSave() {
  if (selected.value === undefined) return;
  delete selected.value.building_materials;
  selected.value.building_material_ids = buildingMaterials.value;
  delete selected.value.technical_constructions;
  selected.value.technical_construction_ids = technicalConstructions.value;
  if (selected.value.id) {
    service
      .update(selected.value.id, selected.value)
      .then(() => {
        filesStore.deleteFiles();
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
        filesStore.deleteFiles();
        emit('saved', selected.value);
        onHide();
      })
      .catch((err) => {
        notifyError(err.message);
      });
  }
}

function onCircleInputUpdated(newValue) {
  if (!selected.value) return;

  if (newValue && newValue.properties && newValue.geometry) {
    selected.value.address = newValue.properties.display_name;
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
</script>
