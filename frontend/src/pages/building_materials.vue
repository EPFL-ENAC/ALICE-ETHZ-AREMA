<script setup lang="ts" generic="T extends any, O extends any">
import { VFileInput, VSelect, VTextField, VTextarea } from 'vuetify/components'
import type { RegenerativeMaterialHeader } from '~/definitions/regenerativeMaterials'
import { useBuildingMaterialStore } from '~/stores/buildingMaterial'

const store = useBuildingMaterialStore()
const title = 'Building materials'

const building_elements = [
"foundation",
"floor load-bearing",
"floor non-load-bearing",
"wall exterior load-bearing",
"wall exterior non-load-bearing",
"wall interior load-bearing",
"wall interior non-load-bearing",
"windows",
"doors",
"structural",
"roof",
"insulation exterior",
"insulation interior",
"cladding interior",
"cladding exterior",
]
// name_nr, zone_nr	amount_nr	mu_nr	lambda_nr	sigma_nr	lca_nr	image1_nr	image2_nr	descr_nr 	editor_0_nr	editor_f_nr	date_0_nr	date_f_nr	date_f_bm	adress_pro	adress_pro_text	ressource_type
const buildingMaterialHeaders: ComputedRef<
  RegenerativeMaterialHeader[]
> = computed(() =>
  [
  {
  name: 'name', // name_nr
  component: VTextField,
  label: "Unique name of building material*", // should also have a unique ID,
  required: true,
  cols: "12", sm: "6", md: "6",
},
{
  name: 'constituant', // natural resource name / unique id
  component: VTextField,
  type: 'number',
  label: "principal constituants", // 
  // suffix: naturalResource.value.dimension, // TODO: make it dynamic
},
    { name: 'description', component: VTextarea, label: 'description', md: 12 },
    { name: 'images', component: VFileInput, label: 'images' },
    {
      label: 'Actions',
      name: 'actions',
      hidden: true,
      cellClass: 'inline-actions',
      hideFooterContent: false,
      width: '190px',
    },
  ].map((x) => ({
    ...x,
    title: x.label,
    align: 'start',
    sortable: false,
    key: x.name,
    placeholder: x.symbol ?? '',
    cols: x?.cols ?? '12',
    sm: x?.sm ?? '6',
    md: x?.md ?? '4',
  })),
)
</script>


<template>
  <v-sheet>
    <ResourcesTable :title="title" :headers="buildingMaterialHeaders" :store="store" />
  </v-sheet>
</template>
