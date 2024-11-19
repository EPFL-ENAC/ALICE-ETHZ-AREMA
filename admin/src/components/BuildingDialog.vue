<template>
  <q-dialog v-model="showDialog" @hide="onHide">
    <q-card class="dialog-lg">
      <q-card-section>
        <div class="text-h6">{{ $t(editMode ? 'edit' : 'add') }}</div>
      </q-card-section>

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
            <q-input
              filled
              v-model="selected.name"
              :label="$t('name') + ' *'"
              class="q-mb-md"
              style="min-width: 200px"
            />
            <q-input
              filled
              v-model="selected.description"
              autogrow
              :label="$t('description')"
              class="q-mb-md"
              style="min-width: 200px"
            />
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
            <point-map-input
              v-model="location"
              height="400px"
              @update:model-value="onPointInputUpdated"
            ></point-map-input>
          </q-tab-panel>
          <q-tab-panel name="multimedia" class="q-pl-none q-pr-none">
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
              v-model="technicalConstructions"
              :options="technicalConstructionsOptions"
              multiple
              map-options
              emit-value
              use-chips
              :label="$t('technical_constructions')"
              :hint="$t('building_technical_construction_used_hint')"
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
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="bg-grey-3">
        <q-btn flat :label="$t('cancel')" color="secondary" v-close-popup />
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
  name: 'BuildingDialog',
});
</script>
<script setup lang="ts">
import {
  BuildingMaterial,
  Building,
  Professional,
  TechnicalConstruction,
} from 'src/models';
import { notifyError } from '../utils/notify';
import PointMapInput from 'src/components/PointMapInput.vue';

interface DialogProps {
  modelValue: boolean;
  item: Building;
}

const props = defineProps<DialogProps>();
const emit = defineEmits(['update:modelValue', 'saved']);

const services = useServices();
const service = services.make('building');
const bmService = services.make('building-material');
const tcService = services.make('technical-construction');
const proService = services.make('professional');

const showDialog = ref(props.modelValue);
const selected = ref<Building>({
  name: '',
} as Building);
const location = ref({});
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
const professionals = ref([]);
const professionalsOptions = ref<
  { label: string | undefined; value: number | undefined }[]
>([]);

const isValid = computed(() => {
  return selected.value.name && selected.value.address;
});

watch(
  () => props.modelValue,
  (value) => {
    tab.value = 'general';
    if (value) {
      selected.value = { ...props.item };
      editMode.value = selected.value.id !== undefined;
      location.value = {};
      if (editMode.value) {
        location.value = {
          type: 'Feature',
          properties: {
            display_name: selected.value.address,
          },
          geometry: {
            type: 'Point',
            coordinates: [selected.value.long, selected.value.lat],
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
    }
    showDialog.value = value;
  },
);

function onHide() {
  showDialog.value = false;
  emit('update:modelValue', false);
}

async function onSave() {
  if (selected.value === undefined) return;
  delete selected.value.building_materials;
  selected.value.building_material_ids = buildingMaterials.value;
  delete selected.value.technical_constructions;
  selected.value.technical_construction_ids = technicalConstructions.value;
  delete selected.value.professionals;
  selected.value.professional_ids = professionals.value;
  if (selected.value.id) {
    service
      .update(selected.value.id, selected.value)
      .then(() => {
        emit('saved', selected.value);
        onHide();
      })
      .catch((err) => {
        notifyError(err.message);
      });
  } else {
    // TODO
    selected.value.files = [];
    service
      .create(selected.value)
      .then(() => {
        emit('saved', selected.value);
        onHide();
      })
      .catch((err) => {
        notifyError(err.message);
      });
  }
}

function onPointInputUpdated(newValue) {
  if (!selected.value) return;
  if (newValue && newValue.properties && newValue.geometry) {
    selected.value.address = newValue.properties.display_name;
    selected.value.geom = { point: newValue.geometry.coordinates };
  } else {
    selected.value.address = undefined;
    selected.value.geom = undefined;
  }
}
</script>
