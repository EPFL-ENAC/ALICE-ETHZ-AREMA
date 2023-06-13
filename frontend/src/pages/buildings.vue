<script setup lang="ts" generic="T extends any, O extends any">
import { VSelect, VTextField } from 'vuetify/components'
import type { Professional, RegenerativeMaterialHeader, TechnicalConstruction } from '~/definitions/regenerativeMaterials'
import { Building } from '~/definitions/regenerativeMaterials'
import { useBuildingStore } from '~/stores/building'

// professionals, technicalConstructions
import { useProfessionalStore } from '~/stores/professional'
import { professional, technicalConstruction } from '~/stores/regenerativeMaterials'
import { useTechnicalConstructionStore } from '~/stores/technicalConstruction'
import { debounce } from 'lodash'
// access the `store` variable anywhere in the component ✨
const store = useBuildingStore()
const title = 'Building'

// todo improve with dynamic search!
const professionalStore = useProfessionalStore()
const technicalConstructionStore = useTechnicalConstructionStore()

const loadingOther = ref(false)
onMounted(async () => {
  loadingOther.value = true
  await professionalStore.getAll()
  await technicalConstructionStore.getAll()
  loadingOther.value = false
})

onBeforeUnmount(async () => {
  await professionalStore.close()
  await technicalConstructionStore.close()
})

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
    {
      path: 'input.adress', // name_nr
      component: VTextField,
      text: 'adress', // should also have a unique ID,
      required: true,
      cols: '12',
      sm: '12',
      md: '12',
    },
    {
      path: 'input.professionals', // name_nr
      text: 'professionals', // should also have a unique ID,
      required: true,
      component: VSelect,
      items: professionalStore.list,
      itemTitle: 'name',
      itemValue: 'id',
      multiple: true,
      formatter: (value: Professional[], _: any, item: any) => {
        // _objects
        return item[`${professional}s_objects`].map((pro: Professional) => pro.name).join(' ')
      },
      cols: '12',
      sm: '12',
      md: '12',
    },
    {
      path: 'input.technicalConstructions', // name_nr
      text: 'technicalConstructions', // should also have a unique ID,
      required: true,
      component: VSelect,
      items: technicalConstructionStore.list,
      itemTitle: (item: TechnicalConstruction) => {
        return `${item.buildingElements_objects?.name} ${item.buildingMaterials_objects?.name}`
      }, //
      itemValue: 'id',
      multiple: true,
      hideContentInTable: true,
      // formatter: (__: TechnicalConstruction[], _: any, item: Building) => {
      //   // _objects
      //   // TODO: find a way to dynamically display the fino
      //   // we need somehow to retrieve technicalConstructionStore to display the fino here :/
      //   return item[`${technicalConstruction}s_objects`]?.map((t: TechnicalConstruction) => t.buildingElement).join(' ')
      // },
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
let loading = ref(false)
const items: Ref<string[]> = ref([])
let search: Ref<string> = ref("")
let select: Ref<string> = ref("")


async function querySelections(v: string) {
  // debounce query serach
  loading.value = true
  // Simulated ajax query
  items.value = await professionalStore.getAll({ limit: 5 })
  loading.value = false
  // setTimeout(() => {
  //   items.value = states.filter(e => {
  //     return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
  //   })
  //   loading.value = false
  // }, 500)
}
const debounceQuerySelections = debounce(querySelections, 300)

</script>

<template>
  <v-sheet>
    {{ items }}
    {{ select }}
    <v-autocomplete v-model="select"
      v-model:search="search" @update:search="debounceQuerySelections" :loading="loading"
      :items="items" item-title="name" item-value="id" class="mx-4" density="comfortable" hide-no-data hide-details
      label="professional" style="max-width: 300px;"></v-autocomplete>

    <ResourcesTable :title="title" :headers="buildingHeaders" :store="store" :loading="loadingOther" />
  </v-sheet>
</template>
