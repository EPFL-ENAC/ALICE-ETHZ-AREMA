<template>
  <div>
    <div class="text-bold q-mb-sm">{{ $t('structural') }}</div>
    <div class="row q-col-gutter-lg">
      <div class="col">
        <property-form-item
          v-for="property in ['density', 'compressive_strength', 'tensile_strength']"
          :key="property"
          v-model="entity"
          :property="property"
        />
      </div>
      <div class="col">
        <property-form-item
          v-for="property in ['youngs_modulus', 'shrinkage', 'settlement']"
          :key="property"
          v-model="entity"
          :property="property"
        />
      </div>
    </div>
    <div class="text-bold q-mb-sm">{{ $t('hygrothermal') }}</div>
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
          v-model="entity"
          :property="property"
        />
      </div>
      <div class="col">
        <property-form-item
          v-for="property in ['u', 'effusivity', 'diffusivity']"
          :key="property"
          v-model="entity"
          :property="property"
        />
      </div>
    </div>
    <div class="text-bold q-mb-sm">{{ $t('acoustic') }}</div>
    <div class="row q-col-gutter-lg">
      <div class="col">
        <property-form-item
          v-for="property in ['absorption_coefficient', 'sound_reduction_index']"
          :key="property"
          v-model="entity"
          :property="property"
        />
      </div>
      <div class="col"></div>
    </div>
    <div class="text-bold q-mb-sm">{{ $t('fire') }}</div>
    <div class="row q-col-gutter-lg">
      <div class="col">
        <property-form-item
          v-for="property in ['reaction_to_fire']"
          :key="property"
          v-model="entity"
          :property="property"
          :options="reactionToFireClasses"
        />
      </div>
      <div class="col">
        <property-form-item
          v-for="property in ['fire_resistance_class']"
          :key="property"
          v-model="entity"
          :property="property"
          :options="fireResistanceClasses"
        />
      </div>
    </div>
    <div class="text-bold q-mb-sm">{{ $t('others') }}</div>
    <div class="row q-col-gutter-lg">
      <div class="col">
        <property-form-item
          v-for="property in ['air_tightness']"
          :key="property"
          v-model="entity"
          :property="property"
        />
      </div>
      <div class="col"></div>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'PhysicalEntityForm',
});
</script>
<script setup lang="ts">
import { PhysicalEntity } from 'src/models';
import PropertyFormItem from 'src/components/PropertyFormItem.vue';

interface Props {
  modelValue: PhysicalEntity;
}

const props = defineProps<Props>();

const entity = ref(props.modelValue);

const reactionToFireClasses = ['A1', 'A2', 'B', 'C', 'D', 'E', 'F'];
const fireResistanceClasses = ['R', 'RE', 'REI', 'EI'];

watch(
  () => props.modelValue,
  (val) => {
    entity.value = val;
  },
);
</script>
