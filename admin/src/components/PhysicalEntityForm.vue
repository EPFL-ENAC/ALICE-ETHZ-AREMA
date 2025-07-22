<template>
  <div>
    <div class="text-bold q-mb-sm">{{ t('structural') }}</div>
    <div class="row q-col-gutter-lg">
      <div class="col">
        <property-form-number
          v-for="property in ['density', 'compressive_strength', 'tensile_strength']"
          :key="property"
          v-model="entity"
          :property="property"
        />
      </div>
      <div class="col">
        <property-form-number
          v-for="property in ['youngs_modulus', 'shrinkage', 'settlement']"
          :key="property"
          v-model="entity"
          :property="property"
        />
      </div>
    </div>
    <div class="text-bold q-mb-sm">{{ t('hygrothermal') }}</div>
    <div class="row q-col-gutter-lg">
      <div class="col">
        <property-form-number
          v-for="property in [
            'thermal_conductivity',
            'thermal_capacity',
            'vapor_diffusion_resistance',
            'moisture_buffering',
            'water_content',
          ]"
          :key="property"
          v-model="entity"
          :property="property"
        />
      </div>
      <div class="col">
        <property-form-number
          v-for="property in [
            'effusivity',
            'diffusivity',
            'porosity',
            'liquid_transfer_coefficient',
            'free_saturation',
          ]"
          :key="property"
          v-model="entity"
          :property="property"
        />
      </div>
    </div>
    <div class="text-bold q-mb-sm">{{ t('acoustic') }}</div>
    <div class="row q-col-gutter-lg">
      <div class="col">
        <property-form-number
          v-for="property in ['absorption_coefficient', 'sound_reduction_index']"
          :key="property"
          v-model="entity"
          :property="property"
        />
      </div>
      <div class="col"></div>
    </div>
    <div class="text-bold q-mb-sm">{{ t('fire') }}</div>
    <div class="row q-col-gutter-lg">
      <div class="col">
        <property-form-suggest
          v-if="reactionToFireClasses"
          v-model="entity"
          :property="'reaction_to_fire'"
          :suggestions="reactionToFireClasses"
          @suggest="onSuggest"
        />
      </div>
      <div class="col">
        <property-form-suggest
          v-if="fireResistanceClasses"
          v-model="entity"
          :property="'fire_resistance_class'"
          :suggestions="fireResistanceClasses"
          @suggest="onSuggest"
        />
      </div>
    </div>
    <div class="text-bold q-mb-sm">{{ t('others') }}</div>
    <div class="row q-col-gutter-lg">
      <div class="col">
        <property-form-number v-model="entity" :property="'air_tightness'" />
      </div>
      <div class="col"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PhysicalEntity } from 'src/models';
import PropertyFormNumber from 'src/components/PropertyFormNumber.vue';
import PropertyFormSuggest from 'src/components/PropertyFormSuggest.vue';
import type { Suggestions } from 'src/components/models';

interface Props {
  modelValue: PhysicalEntity;
}

const props = defineProps<Props>();

const { t } = useI18n();

const entity = ref(props.modelValue);

const reactionToFireClasses = ref<Suggestions>();
const fireResistanceClasses = ref<Suggestions>();

watch(
  () => props.modelValue,
  (val) => {
    entity.value = val;
  },
);

function onSuggest(property: string, key: string, value: string) {
  let suggestions: string[] = [];
  if (property === 'reaction_to_fire') {
    // format suggested: <A1|A2|B|C|D|E|F>-<S1|S2|S3>-<D0|D1|D2>
    const base = ['A1', 'A2', 'B', 'C', 'D', 'E', 'F'];
    if (value && base.find((cls) => value.startsWith(cls))) {
      const tokens = value.split('-');
      const smoke = ['S1', 'S2', 'S3'];
      const droplets = ['D0', 'D1', 'D2'];
      // if value does not contain smoke
      if (tokens.length > 1 && !smoke.find((cls) => tokens[1]?.trim().includes(cls))) {
        suggestions = smoke.map((s) => `${tokens[0]?.trim()}-${s}`);
      } else if (tokens.length > 2 && !droplets.find((cls) => tokens[2]?.trim().includes(cls))) {
        suggestions = droplets.map((d) => `${tokens[0]?.trim()}-${tokens[1]?.trim()}-${d}`);
      } else {
        suggestions = base;
      }
    } else {
      suggestions = base;
    }
    reactionToFireClasses.value = {
      key,
      options: suggestions,
    };
  }
  if (property === 'fire_resistance_class') {
    // format suggested: <R|RE|REI|EI>-<30|60|90|120>
    const base = ['R', 'RE', 'REI', 'EI'];
    if (value && base.find((cls) => value.startsWith(cls))) {
      const tokens = value.split('-');
      const time = ['30', '60', '90', '120'];
      if (tokens.length > 1 && !time.find((cls) => tokens[1]?.trim().includes(cls))) {
        suggestions = time.map((t) => `${tokens[0]?.trim()}-${t}`);
      } else {
        suggestions = base;
      }
    } else {
      suggestions = base;
    }
    fireResistanceClasses.value = {
      key,
      options: suggestions,
    };
  }
}
</script>
