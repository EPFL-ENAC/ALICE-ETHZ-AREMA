<script setup lang="ts" generic="T extends any, O extends any">
import { VFileInput, VSelect, VTextField, VTextarea } from 'vuetify/components'
import type { BuildingElement, NaturalResource, RegenerativeMaterialHeader } from '~/definitions/regenerativeMaterials'
import { useBuildingMaterialStore } from '~/stores/buildingMaterial'
import { useNaturalResourceStore } from '~/stores/naturalResource'
import { useBuildingElementStore } from '~/stores/buildingElement'
import { buildingElement, naturalResource } from '~/stores/regenerativeMaterials'

const buildingMaterialStore = useBuildingMaterialStore()
// todo improve with dynamic search!
const naturalResourceStore = useNaturalResourceStore()
const buildingElementStore = useBuildingElementStore()

const title = 'Building material'
const loading = ref(false)
onMounted(async () => {
  loading.value = true
  await naturalResourceStore.getAll()
  await buildingElementStore.getAll()
  loading.value = false
})

onBeforeUnmount(async () => {
  await naturalResourceStore.close()
  await buildingElementStore.close()
})

// name_nr, zone_nr	amount_nr	mu_nr	lambda_nr	sigma_nr	lca_nr	image1_nr	image2_nr	descr_nr 	editor_0_nr	editor_f_nr	date_0_nr	date_f_nr	date_f_bm	address_pro	address_pro_text	ressource_type
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
      text: 'principal constituants (natural resources)', // natural resource name / unique id
      multiple: true,
      formatter: (value: NaturalResource[], _: any, item: any) => {
        // _objects
        return item[`${naturalResource}s_objects`].map(nr => nr.name).join(' ')
      },
    },
    {
      path: `input.${buildingElement}s`,
      text: 'Usage (Building Elements)',
      component: VSelect,
      items: buildingElementStore.list,
      itemTitle: 'name',
      itemValue: 'id',
      multiple: true,
      formatter: (value: BuildingElement[], _: any, item: any) => {
        return item[`${buildingElement}s_objects`].map(nr => nr.name).join(' ')
      },
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
      :store="buildingMaterialStore"
    />
  </v-sheet>
</template>
