<script setup lang="ts" generic="T extends any, O extends any">
import { VTextField } from 'vuetify/components'
import type { RegenerativeMaterialHeader } from '~/definitions/regenerativeMaterials'
import { useProfessionalStore } from '~/stores/professional'
import CircleMapInput from '~/components/CircleMapInput.vue'

// access the `store` variable anywhere in the component ✨
const store = useProfessionalStore()
// const { item, list, loading } = storeToRefs(store)
const title = 'Professional'

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
      component: VTextField,
      text: 'professionalType', // should also have a unique ID,
      required: true,
      cols: '12',
      sm: '12',
      md: '12',
    }, // ProfessionalType.name,
    {
      path: 'input.buildingMaterials', // name_nr
      component: VTextField,
      text: 'buildingMaterials', // should also have a unique ID,
      required: true,
      cols: '12',
      sm: '12',
      md: '12',
    }, // expertise for suppliers
    {
      path: 'input.naturalResources', // name_nr
      component: VTextField,
      text: 'naturalResources', // should also have a unique ID,
      required: true,
      cols: '12',
      sm: '12',
      md: '12',
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
    <ResourcesTable :title="title" :headers="professionalHeaders" :store="store" />
  </v-sheet>
</template>
