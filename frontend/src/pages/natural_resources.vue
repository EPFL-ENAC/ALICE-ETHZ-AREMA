<script setup lang="ts" generic="T extends any, O extends any">
import { VFileInput, VSelect, VTextField, VTextarea } from 'vuetify/components'
import type { RegenerativeMaterialHeader } from '~/definitions/regenerativeMaterials'
import { useNaturalResourceStore } from '~/stores/naturalResource'
import PolygonsMapInput from '~/components/PolygonsMapInput.vue'

// access the `store` variable anywhere in the component ✨
const store = useNaturalResourceStore()
// const { item, list, loading } = storeToRefs(store)
const title = 'Natural resource'

// name_nr, zone_nr	amount_nr	mu_nr	lambda_nr	sigma_nr	lca_nr	image1_nr	image2_nr	descr_nr 	editor_0_nr	editor_f_nr	date_0_nr	date_f_nr	date_f_bm	adress_pro	adress_pro_text	ressource_type
const naturalResourceHeaders: ComputedRef<
  RegenerativeMaterialHeader[]
> = computed(() =>
  [
    {
      path: 'input.name', // name_nr
      component: VTextField,
      text: 'Unique name of natural resource*', // should also have a unique ID,
      required: true,
      cols: '12',
      sm: '12',
      md: '12',
    },
    {
      path: 'input.zone', // zone_nr
      height: '100px',
      component: PolygonsMapInput,
      text: 'geographic or geologic provenience', // polygon or coordinate + radius
      required: true,
      cols: '12',
      sm: '12',
      md: '12',
    },
    {
      path: 'input.amount', // amount_nr
      component: VTextField,
      type: 'number',
      text: 'approx extend of availability',
      // suffix: naturalResource.value.dimension, // TODO: make it dynamic
    },
    {
      path: 'input.dimension', // new field for amount_nr
      component: VSelect,
      items: ['kg', 'm2', 'm3'],
      text: 'Amount dimensions',
    },
    {
      path: 'input.mu',
      component: VTextField,
      type: 'number',
      text: 'vapourdiffusion',
      suffix: '',
      symbol: 'μ',
      min: 1,
      max: Number.POSITIVE_INFINITY,
    },
    {
      path: 'input.lambda',
      component: VTextField,
      type: 'number',
      text: 'thermal conductivity',
      suffix: 'W/m/K',
      symbol: 'λ',
      min: 0,
      max: 10,
    },
    {
      path: 'input.sigma',
      component: VTextField,
      type: 'number',
      text: 'compressive strength',
      suffix: 'MPa',
      symbol: 'σ',
    },
    {
      path: 'input.lca',
      component: VTextField,
      type: 'number',
      text: 'carbon footprint',
      suffix: 'kgCO2eq',
      symbol: '',
    },
    { path: 'input.description', component: VTextarea, text: 'description', md: 12 },
    {
      'path': 'input.images',
      'component': VFileInput,
      'text': 'images',
      'multiple': true,
      'prepend-icon': 'mdi-camera',
      // 'formatter': (_: File[], header: RegenerativeMaterialHeader, item: NaturalResource[]) => {
      //   return item.images_uploaded.map(nr => nr.url).join(' ')
      // },
    },
    tableActions,
  ].map(ensureHeaders),
)
</script>

<template>
  <v-sheet>
    <ResourcesTable :title="title" :headers="naturalResourceHeaders" :store="store" />
  </v-sheet>
</template>
