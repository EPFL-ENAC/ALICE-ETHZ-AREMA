<script setup lang="ts" generic="T extends any, O extends any">
import { VTextField } from 'vuetify/components'
import type { RegenerativeMaterialHeader } from '~/definitions/regenerativeMaterials'
import { useProfessionalStore } from '~/stores/professional'

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
    tableActions,
  ].map(ensureHeaders),
)
</script>

<template>
  <v-sheet>
    <ResourcesTable :title="title" :headers="professionalHeaders" :store="store" />
  </v-sheet>
</template>
