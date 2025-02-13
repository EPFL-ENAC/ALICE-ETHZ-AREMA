<template>
  <div>
    <q-select
      filled
      v-model="entity.building_material_id"
      :options="buildingMaterialsOptions"
      map-options
      emit-value
      clearable
      :label="$t('building_material')"
      :hint="$t('building_element_building_material_used_hint')"
      class="q-mb-md"
      @update:model-value="onBuildingMaterialChange"
    />
    <div class="row q-col-gutter-lg">
      <div class="col">
        <q-input
          v-model.number="entity.distance"
          type="number"
          filled
          min="0"
          :disable="!entity.building_material_id"
          :label="$t('distance')"
          :hint="$t('building_element_building_material_distance_hint')"
        />
      </div>
      <div class="col">
        <q-input
          v-model.number="entity.weight"
          type="number"
          filled
          min="0"
          :disable="!entity.building_material_id"
          :label="$t('weight')"
          :hint="$t('building_element_building_material_weight_hint')"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'BuildingElementMaterialForm',
});
</script>
<script setup lang="ts">
import { BuildingElementMaterial, TechnicalConstruction } from 'src/models';
import { OptionNumber } from './models';

const services = useServices();
const tcService = services.make('technical-construction');

interface Props {
  modelValue: BuildingElementMaterial;
  technicalContructionId: number;
}

const props = defineProps<Props>();

const entity = ref(props.modelValue);
const buildingMaterialsOptions = ref<OptionNumber[]>([]);

onMounted(() => {
  initBuildingMaterialsOptions();
});

watch([() => props.modelValue, () => props.technicalContructionId], () => {
  entity.value = props.modelValue;
  initBuildingMaterialsOptions();
});

function initBuildingMaterialsOptions() {
  buildingMaterialsOptions.value = [];
  if (!props.technicalContructionId) {
    return;
  }
  tcService.get(props.technicalContructionId).then((response: TechnicalConstruction) => {
    buildingMaterialsOptions.value =
      response.building_materials?.map(
        (bm) =>
          ({
            label: bm.name,
            value: bm.id,
          }) as OptionNumber,
      ) || [];
    if (!entity.value.building_material_id) {
      entity.value.building_material_id = buildingMaterialsOptions.value[0]?.value;
    }
  });
}

function onBuildingMaterialChange() {
  if (entity.value.building_material_id === undefined) {
    entity.value.distance = undefined;
    entity.value.weight = undefined;
  }
}
</script>
