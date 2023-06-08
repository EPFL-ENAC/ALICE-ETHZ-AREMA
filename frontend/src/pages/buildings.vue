<script setup lang="ts" generic="T extends any, O extends any">
import { VTextField } from 'vuetify/components'
import type { RegenerativeMaterialHeader } from '~/definitions/regenerativeMaterials'
import { useBuildingStore } from '~/stores/building'

// access the `store` variable anywhere in the component ✨
const store = useBuildingStore()
// const { item, list, loading } = storeToRefs(store)
const title = 'Building'

const buildingHeaders: ComputedRef<
  RegenerativeMaterialHeader[]
> = computed(() =>
  [
    {
      path: 'input.name', // name_nr
      component: VTextField,
      text: 'Unique name of building*', // should also have a unique ID,
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
    <ResourcesTable :title="title" :headers="buildingHeaders" :store="store" />
  </v-sheet>
</template>
