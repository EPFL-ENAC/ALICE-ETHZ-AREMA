<template>
  <q-dialog v-model="showDialog" @hide="onHide">
    <q-card class="dialog-md">
      <q-card-section>
        <div class="text-h6">{{ $t(editMode ? 'edit' : 'add') }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-tabs v-model="tab" dense align="left" no-caps>
          <q-tab name="general" :label="$t('general')" />
          <q-tab name="structural" :label="$t('structural')" />
          <q-tab name="hygrothermal" :label="$t('hygrothermal')" />
          <q-tab name="acoustic" :label="$t('acoustic')" />
          <q-tab name="fire" :label="$t('fire_resistance')" />
          <q-tab name="others" :label="$t('others')" />
        </q-tabs>
        <q-separator />

        <q-tab-panels v-model="tab">
          <q-tab-panel name="general" class="q-pl-none q-pr-none">
            <q-input
              ref="nameRef"
              filled
              v-model="selected.name"
              :label="$t('name') + '*'"
              class="q-mb-md"
            />
            <q-input
              filled
              v-model="selected.description"
              type="textarea"
              :label="$t('description') + '*'"
              class="q-mb-md"
            />
            <q-select
              filled
              v-model="buildingMaterials"
              :options="buildingMaterialsOptions"
              multiple
              map-options
              emit-value
              use-chips
              :label="$t('building_material_constituants')"
              :hint="
                $t('technical_construction_building_material_constituants_hint')
              "
              class="q-mb-md"
            />
          </q-tab-panel>
          <q-tab-panel name="structural" class="q-pl-none q-pr-none">
            <div class="row q-col-gutter-lg">
              <div class="col">
                <property-form-item
                  v-for="property in [
                    'density',
                    'compressive_strength',
                    'tensile_strength',
                  ]"
                  :key="property"
                  v-model="selected"
                  :property="property"
                />
              </div>
              <div class="col">
                <property-form-item
                  v-for="property in [
                    'youngs_modulus',
                    'shrinkage',
                    'settlement',
                  ]"
                  :key="property"
                  v-model="selected"
                  :property="property"
                />
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="hygrothermal" class="q-pl-none q-pr-none">
            <div class="row q-col-gutter-lg">
              <div class="col">
                <property-form-item
                  v-for="property in [
                    'thermal_conductivity',
                    'thermal_capacity',
                    'vapor_diffusion_resistance',
                    'moisture_buffering',
                  ]"
                  :key="property"
                  v-model="selected"
                  :property="property"
                />
              </div>
              <div class="col">
                <property-form-item
                  v-for="property in ['u', 'effusivity', 'diffusivity']"
                  :key="property"
                  v-model="selected"
                  :property="property"
                />
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="acoustic" class="q-pl-none q-pr-none">
            <div class="row q-col-gutter-lg">
              <div class="col">
                <property-form-item
                  v-for="property in [
                    'absorption_coefficient',
                    'sound_reduction_index',
                  ]"
                  :key="property"
                  v-model="selected"
                  :property="property"
                />
              </div>
              <div class="col"></div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="fire" class="q-pl-none q-pr-none">
            <div class="row q-col-gutter-lg">
              <div class="col">
                <property-form-item
                  v-for="property in [
                    'reaction_to_fire',
                    'building_material_class',
                  ]"
                  :key="property"
                  v-model="selected"
                  :property="property"
                />
              </div>
              <div class="col">
                <property-form-item
                  v-for="property in ['fire_resistance_class']"
                  :key="property"
                  v-model="selected"
                  :property="property"
                />
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="others" class="q-pl-none q-pr-none">
            <div class="row q-col-gutter-lg">
              <div class="col">
                <property-form-item
                  v-for="property in ['air_tightness']"
                  :key="property"
                  v-model="selected"
                  :property="property"
                />
              </div>
              <div class="col"></div>
            </div>
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
  components: { PropertyFormItem },
  name: 'TechnicalConstructionDialog',
});
</script>
<script setup lang="ts">
import { TechnicalConstruction } from 'src/models';
import { notifyError } from '../utils/notify';
import PropertyFormItem from './PropertyFormItem.vue';

interface DialogProps {
  modelValue: boolean;
  item: TechnicalConstruction;
}

const props = defineProps<DialogProps>();
const emit = defineEmits(['update:modelValue', 'saved']);

const services = useServices();
const service = services.make('technical-construction');
const bmService = services.make('building-material');
//const tcBmService = services.make('technical-construction-building-material');

const showDialog = ref(props.modelValue);
const selected = ref<TechnicalConstruction>({
  name: '',
} as TechnicalConstruction);
const editMode = ref(false);
const tab = ref('general');
const buildingMaterials = ref([]);
const buildingMaterialsOptions = ref<
  { label: string | undefined; value: number | undefined }[]
>([]);

const isValid = computed(() => {
  return selected.value.name && selected.value.description;
});

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      selected.value = { ...props.item };
      editMode.value = selected.value.id !== undefined;
      tab.value = 'general';
      buildingMaterials.value = [];
      bmService
        .find({
          $limit: 100,
          $select: ['id', 'name'],
          filter: {},
        })
        .then((res) => {
          buildingMaterialsOptions.value = res.data.map((item) => ({
            label: item.name,
            value: item.id,
          }));
        });
      if (editMode.value) {
        tcBmService
          .find({
            $limit: 100,
            filter: {
              technical_construction_id: selected.value.id,
            },
          })
          .then((res) => {
            buildingMaterials.value = res.data.map((item) =>
              parseInt(item.buildingMaterialId),
            );
          });
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
  if (selected.value.id) {
    delete selected.value.buildingMaterialIds;
    selected.value.files = [];
    service
      .update(selected.value.id, selected.value)
      .then((res) => {
        tcBmService
          .remove(null, {
            query: {
              technicalConstructionId: res.id,
            },
          })
          .finally(() => {
            saveConstituants(selected.value).then(() => {
              onHide();
              emit('saved', selected.value);
            });
          });
      })
      .catch((err) => {
        notifyError(err.message);
      });
  } else {
    // TODO
    selected.value.files = [];
    service
      .create(selected.value)
      .then((res) => {
        saveConstituants(res).then(() => {
          onHide();
          emit('saved', res);
        });
      })
      .catch((err) => {
        notifyError(err.message);
      });
  }
}

async function saveConstituants(tc: TechnicalConstruction) {
  if (buildingMaterials.value.length === 0) return Promise.resolve();
  return tcBmService.create(
    buildingMaterials.value.map((item) => ({
      technicalConstructionId: tc.id,
      buildingMaterialId: item,
    })),
  );
}
</script>
