<script setup lang="ts" generic="T extends any, O extends any">
import { VSelect, VTextField } from 'vuetify/components'
import type { BuildingMaterial, NaturalResource, ProfessionalType, RegenerativeMaterialHeader } from '~/definitions/regenerativeMaterials'
import { useBuildingMaterialStore } from '~/stores/buildingMaterial';
import { useNaturalResourceStore } from '~/stores/naturalResource';
import { useProfessionalStore } from '~/stores/professional'
import CircleMapInput from '~/components/CircleMapInput.vue'
import { useProfessionalTypeStore } from '~/stores/professionalType';
import { buildingMaterial, naturalResource, professionalType } from '~/stores/regenerativeMaterials';

// access the `store` variable anywhere in the component ✨
const store = useProfessionalStore()
const title = 'Professional'
// reference to have: professionalType, buildingMaterials, naturalResources
const professionalTypeStore = useProfessionalTypeStore()
const naturalResourceStore = useNaturalResourceStore()
const buildingMaterialStore = useBuildingMaterialStore()

const loading = ref(false)
onMounted(async () => {
  loading.value = true
  await professionalTypeStore.getAll()
  await naturalResourceStore.getAll()
  await buildingMaterialStore.getAll()
  loading.value = false
})

onBeforeUnmount(async () => {
  await professionalTypeStore.close()
  await naturalResourceStore.close()
  await buildingMaterialStore.close()
})

// TODO: avoid joint in vSelect + improve with dynamic search!
const professionalHeaders: ComputedRef<
  RegenerativeMaterialHeader[]
> = computed(() =>
  [
    {
      path: 'input.name', // name_nr
      component: VTextField,
      text: 'Unique name of professionals*', // should also have a unique ID,
      required: true,
      cols: '12',
      sm: '12',
      md: '12',
    },
    {
      path: 'input.professionalType', // name_nr
      component: VSelect,
      text: 'professionalType', // should also have a unique ID,
      required: true,
      cols: '12',
      sm: '12',
      md: '12',
      items: professionalTypeStore.list,
      itemTitle: 'value',
      itemValue: 'id',
      multiple: false,
      formatter: (value: ProfessionalType[], _: any, item: any) => {
        // _objects
        return item[`${professionalType}s_objects`].value
      },
    }, // ProfessionalType.name,
    {
      path: 'input.buildingMaterials', // name_nr
      component: VSelect,
      text: 'buildingMaterials', // should also have a unique ID,
      required: true,
      cols: '12',
      sm: '12',
      md: '12',
      items: buildingMaterialStore.list,
      itemTitle: 'name',
      itemValue: 'id',
      multiple: true,
      formatter: (value: BuildingMaterial[], _: any, item: any) => {
        // _objects
        return item[`${buildingMaterial}s_objects`].map((obj: BuildingMaterial) => obj.name).join(' ')
      },
    }, // expertise for suppliers
    {
      path: 'input.naturalResources', // name_nr
      component: VSelect,
      text: 'naturalResources', // should also have a unique ID,
      required: true,
      cols: '12',
      sm: '12',
      md: '12',
      items: naturalResourceStore.list,
      itemTitle: 'name',
      itemValue: 'id',
      multiple: true,
      formatter: (value: NaturalResource[], _: any, item: any) => {
        // _objects
        return item[`${naturalResource}s_objects`].map((obj: NaturalResource) => obj.name).join(' ')
      },
    }, // expertise for supplisers
    {
      path: 'input.zone', // zone_nr
      height: '200px',
      component: CircleMapInput,
      text: 'location and area', // address, coordinate + radius
      required: true,
      hideContentInTable: true,
      cols: '12',
      sm: '12',
      md: '12',
    },
    {
      path: 'input.url', // name_nr
      component: VTextField,
      text: 'url', // should also have a unique ID,
      required: true,
      cols: '12',
      sm: '12',
      md: '12',
    },
    {
      path: 'input.tel', // name_nr
      component: VTextField,
      text: 'tel', // should also have a unique ID,
      required: true,
      cols: '12',
      sm: '12',
      md: '12',
    },
    {
      path: 'input.email', // name_nr
      component: VTextField,
      text: 'email', // should also have a unique ID,
      required: true,
      cols: '12',
      sm: '12',
      md: '12',
    },
    {
      path: 'input.images', // name_nr
      component: VTextField,
      text: 'images', // should also have a unique ID,
      required: true,
      cols: '12',
      sm: '12',
      md: '12',
    },
    {
      path: 'input.logo', // name_nr
      component: VTextField,
      text: 'logo', // should also have a unique ID,
      required: true,
      cols: '12',
      sm: '12',
      md: '12',
    },
    {
      path: 'input.description', // name_nr
      component: VTextField,
      text: 'description', // should also have a unique ID,
      required: true,
      cols: '12',
      sm: '12',
      md: '12',
    },
    tableActions,
  ].map(ensureHeaders),
)
</script>

<template>
  <v-sheet>
    <ResourcesTable :title="title" :headers="professionalHeaders" :store="store" :loading="loading"/>
  </v-sheet>
</template>
