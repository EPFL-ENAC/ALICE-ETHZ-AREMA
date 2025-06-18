<template>
  <div class="row q-col-gutter-md">
    <template v-for="section in sections" :key="section">
      <div class="col-12 col-lg-6" v-if="hasValues(section)">
        <div class="text-h6">{{ $t(section) }}</div>
        <q-list dense class="q-mb-md">
          <template v-for="field in fields[section]" :key="field">
            <q-item v-if="hasFieldValue(field)" class="q-pa-none" style="padding: 0 !important">
              <q-item-section>
                <q-item-label
                  >{{ $t(field) }}
                  <span v-if="$t(`${field}_symbol`)"
                    >- <span class="text-bold">{{ $t(`${field}_symbol`) }}</span></span
                  ></q-item-label
                >
              </q-item-section>
              <q-item-section avatar>
                <q-item-label caption>
                  <span
                    v-for="(value, index) in getFieldValue(field)"
                    :key="index"
                    :title="index === 0 ? $t('low') : index === 1 ? $t('standard') : $t('high')"
                  >
                    {{ value }}
                    <span v-if="index < getFieldValue(field).length - 1"> / </span>
                  </span>
                  <span v-if="$t(`${field}_unit`)">[{{ $t(`${field}_unit`) }}]</span></q-item-label
                >
              </q-item-section>
            </q-item>
            <q-separator v-if="hasFieldValue(field)" color="primary" />
          </template>
        </q-list>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Document } from 'src/models';

interface Props {
  document: Document;
}

const props = defineProps<Props>();

const mechanicalParams = [
  'density',
  'compressive_strength',
  'tensile_strength',
  'youngs_modulus',
  'shrinkage',
  'settlement',
];
const hygrothermalParams = [
  'thermal_conductivity',
  'thermal_capacity',
  'vapor_diffusion_resistance',
  'moisture_buffering',
  'effusivity',
  'diffusivity',
  'porosity',
  'liquid_transfer_coefficient',
  'water_content',
  'free_saturation',
];
const acousticParams = ['absorption_coefficient', 'sound_reduction_index'];
const fireParams = ['reaction_to_fire', 'fire_resistance_class'];

const sections = ['mechanical', 'hygrothermal', 'acoustic', 'fire'];
const fields: { [key: string]: string[] } = {
  mechanical: mechanicalParams,
  hygrothermal: hygrothermalParams,
  acoustic: acousticParams,
  fire: fireParams,
  others: ['air_tightness'],
};

function hasValues(section: string) {
  return fields[section].some((param) => hasFieldValue(param));
}

function hasFieldValue(field: string) {
  return getFieldValues(field).some((value) => value);
}

function getFieldValues(field: string) {
  return [props.document[`${field}_low`], props.document[field], props.document[`${field}_high`]];
}

function getFieldValue(field: string) {
  const values = getFieldValues(field);
  return values.map((value) => value || ' - ');
}
</script>
