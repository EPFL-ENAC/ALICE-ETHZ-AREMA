<template>
  <div>
    <div class="row q-col-gutter-lg">
      <div class="col">
        <q-select
          filled
          v-model="entity.technical_construction_id"
          :options="technicalConstructionsOptions"
          map-options
          emit-value
          clearable
          :label="t('technical_construction')"
          :hint="t('building_element_technical_construction_used_hint')"
          @update:model-value="onTechnicalConstructionChange"
        />
      </div>
      <div class="col">
        <q-select
          filled
          v-model="entity.professional_ids"
          :options="professionalsOptions"
          map-options
          emit-value
          multiple
          use-chips
          :label="t('professionals')"
          :hint="t('building_element_professionals_hint')"
        />
      </div>
    </div>
    <div v-if="entity.technical_construction_id">
      <div class="text-bold q-mt-md q-mb-xs">{{ t('building_element_materials') }}</div>
      <div class="text-hint q-mb-sm">{{ t('building_element_materials_hint') }}</div>
      <q-card flat bordered class="bg-white">
        <q-card-section class="q-pa-none">
          <div v-if="entity.materials?.length === 0" class="text-help q-pt-sm q-pr-md q-pl-md">
            {{ t('no_building_element_materials') }}
          </div>
          <q-list separator>
            <q-item v-for="(mat, index) in entity.materials" :key="index">
              <q-item-section>
                <building-element-material-form
                  v-if="entity.materials && entity.materials[index]"
                  v-model="entity.materials[index]"
                  :technical-contruction-id="entity.technical_construction_id"
                />
              </q-item-section>
              <q-item-section side>
                <q-btn
                  rounded
                  dense
                  flat
                  color="grey-6"
                  :title="t('delete')"
                  icon="delete"
                  @click="onRemoveBuildingElementMaterial(index)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions class="q-pa-md">
          <q-btn color="secondary" icon="add" size="sm" @click="onAddBuildingElementMaterial" />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BuildingElement } from 'src/models';
import type { Option } from './models';
import BuildingElementMaterialForm from './BuildingElementMaterialForm.vue';

interface Props {
  modelValue: BuildingElement;
  technicalConstructionsOptions: Option[];
  professionalsOptions: Option[];
}

const props = defineProps<Props>();

const entity = ref(props.modelValue);

const { t } = useI18n();

watch(
  () => props.modelValue,
  (value) => {
    entity.value = value;
    if (!entity.value.materials) {
      entity.value.materials = [];
    }
  },
);

function onRemoveBuildingElementMaterial(index: number) {
  entity.value.materials?.splice(index, 1);
}

function onAddBuildingElementMaterial() {
  if (!entity.value.materials) {
    entity.value.materials = [];
  }
  entity.value.materials.push({});
}

function onTechnicalConstructionChange() {
  entity.value.materials = [];
}
</script>
