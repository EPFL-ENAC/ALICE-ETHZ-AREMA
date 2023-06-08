<script setup lang="ts" generic="T extends any, O extends any">
import { VFileInput, VSelect } from 'vuetify/components'
import type { BuildingElement, BuildingMaterial, RegenerativeMaterialHeader } from '~/definitions/regenerativeMaterials'
import { buildingElement, buildingMaterial } from '~/stores/regenerativeMaterials'
import { useBuildingMaterialStore } from '~/stores/buildingMaterial'
import { useBuildingElementStore } from '~/stores/buildingElement'
import { useTechnicalConstructionStore } from '~/stores/technicalConstruction'

// access the `store` variable anywhere in the component ✨
const store = useTechnicalConstructionStore()
// todo improve with dynamic search!
const buildingMaterialStore = useBuildingMaterialStore()
const buildingElementStore = useBuildingElementStore()

const loading = ref(false)
onMounted(async () => {
  loading.value = true
  await buildingMaterialStore.getAll()
  await buildingElementStore.getAll()
  loading.value = false
})

onBeforeUnmount(async () => {
  await buildingMaterialStore.close()
  await buildingElementStore.close()
})

const title = 'Technical construction'

const technicalConstructionHeaders: ComputedRef<
  RegenerativeMaterialHeader[]
> = computed(() =>
  [
    {
      path: `input.${buildingElement}`,
      text: 'Building Element*',
      component: VSelect,
      items: buildingElementStore.list,
      itemTitle: 'name',
      itemValue: 'id',
      multiple: false,
      formatter: (value: BuildingElement[], _: any, item: any) => {
        return item[`${buildingElement}s_objects`].name
      },
    },
    {
      path: `input.${buildingMaterial}`,
      text: 'Building Material*',
      component: VSelect,
      items: buildingMaterialStore.list,
      itemTitle: 'name',
      itemValue: 'id',
      multiple: false,
      formatter: (value: BuildingMaterial[], _: any, item: any) => {
        return item[`${buildingMaterial}s_objects`].name
      },
    },
    {
      'path': 'input.images',
      'component': VFileInput,
      'text': 'images',
      'multiple': true,
      'prepend-icon': 'mdi-camera',
      'hideContentInTable': true,

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
    <ResourcesTable :title="title" :headers="technicalConstructionHeaders" :store="store" />
  </v-sheet>
</template>
