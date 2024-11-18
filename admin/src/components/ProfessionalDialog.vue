<template>
  <q-dialog v-model="showDialog" @hide="onHide">
    <q-card class="dialog-md">
      <q-card-section>
        <div class="text-h6">{{ $t(editMode ? 'edit' : 'add') }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row q-mb-md q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <q-input
              filled
              v-model="selected.name"
              :label="$t('name')"
              style="min-width: 200px"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-select
              filled
              clearable
              v-model="selected.type"
              :options="DefaultProfessionalTypes"
              :label="$t('type')"
              style="min-width: 200px"
              emit-value
              map-options
            />
          </div>
        </div>
        <q-input
          filled
          v-model="selected.description"
          autogrow
          :label="$t('description')"
          class="q-mb-md"
          style="min-width: 200px"
        />
        <div class="row q-mb-md q-col-gutter-md">
          <div class="col-12 col-sm-4">
            <q-input
              filled
              v-model="selected.tel"
              :label="$t('phone')"
              style="min-width: 200px"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              filled
              v-model="selected.email"
              type="email"
              :label="$t('email')"
              style="min-width: 200px"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              filled
              v-model="selected.web"
              :label="$t('website')"
              style="min-width: 200px"
            />
          </div>
        </div>
        <div class="q-mb-md">
          <circle-map-input
            v-model="circle"
            height="200px"
            @update:model-value="onCircleInputUpdated"
          ></circle-map-input>
        </div>
        <div class="row q-mb-md q-col-gutter-md">
          <div class="col-12 col-sm-6">
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
          </div>
          <div class="col-12 col-sm-6">
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
          </div>
        </div>
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
  name: 'ProfessionalDialog',
});
</script>
<script setup lang="ts">
import {
  BuildingMaterial,
  Professional,
  TechnicalConstruction,
} from 'src/models';
import { DefaultProfessionalTypes } from 'src/utils/options';
import { notifyError } from '../utils/notify';
import CircleMapInput from 'src/components/CircleMapInput.vue';

interface DialogProps {
  modelValue: boolean;
  item: Professional;
}

const props = defineProps<DialogProps>();
const emit = defineEmits(['update:modelValue', 'saved']);

const services = useServices();
const service = services.make('professional');
const bmService = services.make('building-material');
const tcService = services.make('technical-construction');

const showDialog = ref(props.modelValue);
const selected = ref<Professional>({
  name: '',
} as Professional);
const circle = ref({});
const editMode = ref(false);
const buildingMaterials = ref([]);
const buildingMaterialsOptions = ref<
  { label: string | undefined; value: number | undefined }[]
>([]);
const technicalConstructions = ref([]);
const technicalConstructionsOptions = ref<
  { label: string | undefined; value: number | undefined }[]
>([]);

const isValid = computed(() => {
  return selected.value.name && selected.value.type && selected.value.address;
});

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      selected.value = { ...props.item };
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

function onCircleInputUpdated(newValue) {
  if (!selected.value) return;

  if (newValue && newValue.properties && newValue.geometry) {
    selected.value.address = newValue.properties.display_name;
    selected.value.radius = newValue.properties.circleRadius;
    selected.value.long = newValue.geometry.coordinates[0][0][0];
    selected.value.lat = newValue.geometry.coordinates[0][0][1];
  } else {
    selected.value.address = undefined;
    selected.value.radius = undefined;
    selected.value.long = undefined;
    selected.value.lat = undefined;
  }
}
</script>
