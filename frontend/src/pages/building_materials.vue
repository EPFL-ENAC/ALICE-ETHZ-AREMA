<script setup lang="ts" generic="T extends any, O extends any">
import { VFileInput, VSelect, VTextField, VTextarea } from 'vuetify/components'
import type { RegenerativeMaterialHeader } from '~/definitions/regenerativeMaterials'
import { useBuildingMaterialStore } from '~/stores/buildingMaterial'
import { useNaturalResourceStore } from '~/stores/naturalResource'
import { useBuildingElementStore } from '~/stores/buildingElement'
import { buildingElement, naturalResource } from '~/stores/regenerativeMaterials'
import { table } from 'console'

const store = useBuildingMaterialStore()
const naturalResourceStore = useNaturalResourceStore()
// move to init.
naturalResourceStore.getAll()
const title = 'Building materials'
console.log(naturalResourceStore.list)

const buildingElementStore = useBuildingElementStore()
buildingElementStore.getAll()
console.log(buildingElementStore.list)

// name_nr, zone_nr	amount_nr	mu_nr	lambda_nr	sigma_nr	lca_nr	image1_nr	image2_nr	descr_nr 	editor_0_nr	editor_f_nr	date_0_nr	date_f_nr	date_f_bm	adress_pro	adress_pro_text	ressource_type
const buildingMaterialHeaders: ComputedRef<
  RegenerativeMaterialHeader[]
> = computed(() =>
  [
    {
      path: 'input.name', // name_nr
      component: VTextField,
      text: 'Unique name of building material*', // should also have a unique ID,
      required: true,
      cols: '12',
      sm: '6',
      md: '6',
    },
    {
      path: `input.${naturalResource}s`,
      component: VSelect,
      items: naturalResourceStore.list,
      itemTitle: 'name',
      itemValue: 'id',
      text: 'principal constituants', // natural resource name / unique id
      multiple: true,
      // formatter: (_id: string, _: unknown, localItem: EnergyCookingItem) => {
      //   // todo: implement formatter in table
      //   return 'string'
      // },
    },
    {
      path: `input.${buildingElement}s`,
      text: 'Usage',
      component: VSelect,
      items: buildingElementStore.list,
      itemTitle: 'name',
      itemValue: 'id',
      multiple: true,
    },
    { path: 'input.description', text: 'description', component: VTextarea, md: 12 },
    { path: 'input.images', text: 'images', component: VFileInput },
    tableActions,
  ].map(ensureHeaders))
</script>

<template>
  <v-sheet>
    <ResourcesTable
      :title="title"
      :headers="buildingMaterialHeaders"
      :store="store"
    />
  </v-sheet>
</template>
