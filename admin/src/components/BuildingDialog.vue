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
          <q-tab name="general" :label="$t('general') + ' *'" />
          <q-tab name="location" :label="$t('location') + ' *'" />
          <q-tab name="multimedia" :label="$t('multimedia')" />
          <q-tab name="relations" :label="$t('relations')" />
        </q-tabs>
        <q-separator />

        <q-tab-panels v-model="tab">
          <q-tab-panel name="general" class="q-pl-none q-pr-none">
            <div class="row q-mb-md q-col-gutter-md">
              <div class="col-12 col-sm-3">
                <q-input filled v-model="selected.name" :label="$t('name') + ' *'" />
              </div>
              <div class="col-12 col-sm-3">
                <taxonomy-select
                  v-model="selected.type"
                  entity-type="building"
                  path="type"
                  :label="$t('type') + ' *'"
                />
              </div>
              <div class="col-12 col-sm-3">
                <taxonomy-select v-model="selected.status" entity-type="building" path="status" :label="$t('status')" />
              </div>
              <div class="col-12 col-sm-3">
                <taxonomy-select
                  v-model="selected.materials"
                  entity-type="natural-resource"
                  path="type"
                  :label="$t('materials')"
                  multiple
                />
              </div>
            </div>
            <div class="row q-mb-md q-col-gutter-md">
              <div class="col-12 col-sm-4">
                <q-input filled v-model="selected.client" :label="$t('client')" />
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  filled
                  v-model.number="selected.gross_internal_area"
                  type="number"
                  :label="$t('gross_internal_area')"
                  :hint="$t('gross_internal_area_hint')"
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input filled v-model.number="selected.year" type="number" :label="$t('year_of_construction')" />
              </div>
            </div>
            <text-input
              v-model="selected.description"
              :label="$t('description')"
              :hint="$t('description_bd_hint')"
              class="q-mb-md"
            />
            <text-input
              v-model="selected.article_top"
              :label="$t('article_top')"
              :hint="$t('article_top_bd_hint')"
              class="q-mb-md"
            />
            <text-input
              v-model="selected.article_bottom"
              :label="$t('article_bottom')"
              :hint="$t('article_bottom_bd_hint')"
              class="q-mb-md"
            />
            <text-input v-model="selected.side_note" :label="$t('side_note')" class="q-mb-md" />
            <text-input v-model="selected.external_links" :label="$t('external_links')" class="q-mb-md" />
          </q-tab-panel>
          <q-tab-panel name="location" class="q-pl-none q-pr-none">
            <point-map-input
              v-model="location"
              height="400px"
              @update:model-value="onPointInputUpdated"
            ></point-map-input>
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
              :hint="$t('building_building_material_used_hint')"
              class="q-mb-md"
            />
            <q-select
              filled
              v-model="professionals"
              :options="professionalsOptions"
              multiple
              map-options
              emit-value
              use-chips
              :label="$t('professionals')"
              :hint="$t('building_professionals_hint')"
              class="q-mb-md"
            />

            <div class="text-bold q-mb-sm">{{ $t('building_elements') }}</div>
            <q-card flat bordered class="bg-grey-2">
              <q-card-section class="q-pa-none">
                <div v-if="buildingElements?.length === 0" class="text-help q-pa-md">
                  {{ $t('no_building_elements') }}
                </div>
                <q-list separator>
                  <q-item v-for="(element, index) in buildingElements" :key="index">
                    <q-item-section>
                      <building-element-form
                        v-model="buildingElements[index]"
                        :technical-constructions-options="technicalConstructionsOptions"
                        :professionals-options="professionalsOptions"
                      />
                    </q-item-section>
                    <q-item-section side>
                      <q-btn
                        rounded
                        dense
                        flat
                        color="negative"
                        :title="$t('delete')"
                        icon="delete"
                        @click="onRemoveBuildingElement(index)"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
              <q-card-actions class="q-pa-md">
                <q-btn color="primary" icon="add" size="sm" @click="onAddBuildingElement" />
              </q-card-actions>
            </q-card>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="bg-grey-3">
        <q-btn flat :label="$t('cancel')" color="secondary" @click="onCancel" v-close-popup />
        <q-btn :label="$t('save')" color="primary" @click="onSave" :disable="!isValid" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
export default defineComponent({
  name: 'BuildingDialog',
});
</script>
<script setup lang="ts">
import { BuildingMaterial, Building, Professional, TechnicalConstruction, BuildingElement } from 'src/models';
import { notifyError } from 'src/utils/notify';
import PointMapInput from 'src/components/PointMapInput.vue';
import FilesInput from 'src/components/FilesInput.vue';
import TaxonomySelect from 'src/components/TaxonomySelect.vue';
import BuildingElementForm from 'src/components/BuildingElementForm.vue';
import { Option } from 'src/components/models';
import TextInput from 'src/components/TextInput.vue';
import type { Feature } from '@turf/turf';

interface DialogProps {
  modelValue: boolean;
  item: Building;
}

const props = defineProps<DialogProps>();
const emit = defineEmits(['update:modelValue', 'saved']);

const filesStore = useFilesStore();
const services = useServices();
const service = services.make('building');
const bmService = services.make('building-material');
const tcService = services.make('technical-construction');
const proService = services.make('professional');
const beService = services.make('building-element');

const showDialog = ref(props.modelValue);
const selected = ref<Building>({
  name: '',
  files: [],
  type: '',
} as Building);
const location = ref<Feature>({} as Feature);
const editMode = ref(false);
const tab = ref('general');
const buildingMaterials = ref([]);
const buildingMaterialsOptions = ref<Option[]>([]);
const technicalConstructions = ref([]);
const technicalConstructionsOptions = ref<Option[]>([]);
const professionals = ref([]);
const professionalsOptions = ref<Option[]>([]);
const buildingElements = ref<BuildingElement[]>([]);

const isValid = computed(() => {
  return selected.value.name && selected.value.type && selected.value.address;
});

watch(
  () => props.modelValue,
  (value) => {
    tab.value = 'general';
    if (value) {
      // deep copy
      selected.value = JSON.parse(JSON.stringify(props.item));
      editMode.value = selected.value.id !== undefined;
      location.value = {} as Feature;
      if (editMode.value) {
        location.value = {
          type: 'Feature',
          properties: {
            addressInput: selected.value.address,
          },
          geometry: {
            type: 'Point',
            coordinates: [selected.value.long || 0, selected.value.lat || 0],
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
          buildingMaterialsOptions.value = res.data.map((item: BuildingMaterial) => ({
            label: item.name,
            value: item.id,
          }));
        });
      if (editMode.value) {
        buildingMaterials.value = selected.value.building_materials
          ? selected.value.building_materials.map((item: BuildingMaterial) => item.id)
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
          technicalConstructionsOptions.value = res.data.map((item: TechnicalConstruction) => ({
            label: item.name,
            value: item.id,
          }));
        });

      professionals.value = [];
      proService
        .find({
          $limit: 100,
          $select: ['id', 'name'],
          filter: {},
        })
        .then((res) => {
          professionalsOptions.value = res.data.map((item: Professional) => ({
            label: item.name,
            value: item.id,
          }));
        });
      if (editMode.value) {
        professionals.value = selected.value.professionals
          ? selected.value.professionals.map((item: Professional) => item.id)
          : [];
      }

      buildingElements.value = [];
      if (editMode.value) {
        beService
          .find({
            $limit: 100,
            $select: [],
            filter: { building_id: selected.value.id },
          })
          .then((res) => {
            buildingElements.value =
              res.data?.map((be: BuildingElement) => {
                be.professional_ids = be.professionals?.map((item: Professional) => item.id) || [];
                delete be.professionals;
                return be;
              }) || [];
          });
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
  delete selected.value.professionals;
  selected.value.professional_ids = professionals.value;
  delete selected.value.building_elements;
  selected.value.building_elements = buildingElements.value;
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

function onPointInputUpdated(newValue: Feature) {
  if (!selected.value) return;
  if (newValue && newValue.properties && newValue.geometry) {
    selected.value.address = newValue.properties.addressInput;
    selected.value.geom = { point: newValue.geometry.coordinates };
    selected.value.lat = newValue.geometry.coordinates[1];
    selected.value.long = newValue.geometry.coordinates[0];
  } else {
    selected.value.address = undefined;
    selected.value.geom = undefined;
    selected.value.lat = undefined;
    selected.value.long = undefined;
  }
}

function onAddBuildingElement() {
  buildingElements.value.push({
    building_id: selected.value.id,
    technical_construction_id: undefined,
    professional_ids: [],
  });
}

function onRemoveBuildingElement(index: number) {
  buildingElements.value.splice(index, 1);
}
</script>
