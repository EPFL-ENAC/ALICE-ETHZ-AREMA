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
              v-model="constituants"
              :options="constituantsOptions"
              multiple
              map-options
              emit-value
              use-chips
              :label="$t('constituants')"
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
  name: 'BuildingMaterialDialog',
});
</script>
<script setup lang="ts">
import { BuildingMaterial } from '@epfl-enac/arema';
import { notifyError } from '../utils/notify';
import PropertyFormItem from './PropertyFormItem.vue';

interface DialogProps {
  modelValue: boolean;
  item: BuildingMaterial;
}

const props = defineProps<DialogProps>();
const emit = defineEmits(['update:modelValue', 'saved']);

const { api } = useFeathers();
const service = api.service('building-material');
const nrService = api.service('natural-resource');
const bmNrService = api.service('building-material-natural-resource');

const showDialog = ref(props.modelValue);
const selected = ref<BuildingMaterial>({ name: '' } as BuildingMaterial);
const editMode = ref(false);
const tab = ref('general');
const constituants = ref([]);
const constituantsOptions = ref<{ label: string; value: number }>([]);

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
      constituants.value = [];
      nrService
        .find({
          query: {
            $limit: 100,
            $select: ['id', 'name'],
          },
        })
        .then((res) => {
          constituantsOptions.value = res.data.map((item) => ({
            label: item.name,
            value: item.id,
          }));
        });
      if (editMode.value) {
        bmNrService
          .find({
            query: {
              buildingMaterialId: selected.value.id,
              $limit: 100,
            },
          })
          .then((res) => {
            constituants.value = res.data.map((item) =>
              parseInt(item.naturalResourceId),
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
    service
      .patch(selected.value.id, selected.value)
      .then((res) => {
        emit('saved', selected.value);
        bmNrService
          .remove(null, {
            query: {
              buildingMaterialId: res.id,
            },
          })
          .finally(() => {
            saveConstituants(selected.value).then(() => {
              onHide();
            });
          });
        onHide();
      })
      .catch((err) => {
        notifyError(err.message);
      });
  } else {
    // TODO
    selected.value.images = [];
    service
      .create(selected.value)
      .then((res) => {
        emit('saved', res);
        saveConstituants(res).then(() => {
          onHide();
        });
      })
      .catch((err) => {
        notifyError(err.message);
      });
  }
}

async function saveConstituants(bm: BuildingMaterial) {
  if (constituants.value.length === 0) return Promise.resolve();
  return bmNrService.create(
    // {
    //   buildingMaterialId: bm.id,
    //   naturalResourceId: constituants.value[0],
    // },
    constituants.value.map((item) => ({
      buildingMaterialId: bm.id,
      naturalResourceId: item,
    })),
  );
}
</script>
