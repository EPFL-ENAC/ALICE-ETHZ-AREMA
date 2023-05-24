<template>
  <v-sheet>
    <v-row>
      <h2>
        Building Materials
      </h2>
    </v-row>

    <v-row justify="end">
      <v-dialog v-model="dialog" persistent width="1024">
        <template v-slot:activator="{ props }">
          <v-btn color="primary" v-bind="props">
            Add new Building Material
          </v-btn>
        </template>
        <NaturalResourcesCard @update:dialog="updateDialog" :naturalResourceHeader="naturalResourceHeaders"/>
      </v-dialog>
    </v-row>
    <v-row justify="center" v-if="store.naturalResources">
      <v-data-table :loading="store.loading"
        v-model:items-per-page="itemsPerPage"
        :headers="naturalResourceHeaders" :items="store.naturalResources"
        class="elevation-1">
        <template v-slot:item.actions="{ item }">
          <v-icon
            size="small"
            class="me-2"
            @click.stop="() => openDialog(item.raw, 'item-dialog')"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            size="small"
            @click="deleteItem(item.raw, 'delete-item')"
          >
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          no data...
        </template>
       
      </v-data-table>
    </v-row>
  </v-sheet>
</template>


<script setup lang="ts" generic="T extends any, O extends any">
import { storeToRefs } from "pinia";

import { VTextField, VSelect, VTextarea, VFileInput } from 'vuetify/components'
import { VDataTable,} from 'vuetify/labs/components'
import type { NaturalResource, NaturalResourceHeader } from "~/definitions/naturalResources";
import { useNaturalResourceStore } from '~/stores/naturalResource';

// access the `store` variable anywhere in the component ✨
const store = useNaturalResourceStore()
const { naturalResource } = storeToRefs(store)


const dialog = ref(false);
const itemsPerPage = 20;


async function updateDialog(e: boolean){
  dialog.value = e;
  naturalResource.value = store.getNewNaturalResource();
  await store.getNaturalResources();

}
async function openDialog(value: NaturalResource, name: string) {
  dialog.value = true;
  naturalResource.value = value;
}

async function deleteItem(value: NaturalResource) {
  // dialog.value = true;
  await store.remove(value);
  console.log('delete some stuffs');
  await store.getNaturalResources();
}



onMounted(async () => {
  console.log("MOUNTED RIGHT")
  await store.getNaturalResources()
});

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
const naturalResourceHeaders: ComputedRef<NaturalResourceHeader[]> = computed(() => [{
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
// {
//   name: 'usage', // new field for amount_nr
//   component: VSelect,
//   items: building_elements,
//   label: "which are the common uses",
//   // range ? 0-3 what do you mean ?
// },
{ name: 'mu', component: VTextField, type: 'number', label: 'vapourdiffusion', suffix: '', symbol: 'μ', min: 1, max: Number.POSITIVE_INFINITY },
{ name: 'lambda', component: VTextField, type: 'number', label: 'thermal conductivity', suffix: 'W/m/K', symbol: 'λ', min: 0, max: 10},
{ name: 'sigma', component: VTextField, type: 'number', label: 'compressive strength', suffix: 'MPa', symbol: 'σ' },
{ name: 'lca', component: VTextField, type: 'number', label: 'carbon footprint', suffix: 'kgCO2eq', symbol: '' },
{ name: 'description', component: VTextarea, label: 'description', md: 12},
{ name: 'images', component: VFileInput, label: 'images'},
{
    label: 'Actions', name: 'actions',
    hidden: true,
    cellClass: "inline-actions",
    hideFooterContent: false,
    width: "190px",
  },
].map((x) => ({
  ...x,
  title: x.label,
  align: 'start',
  sortable: false,
  key: x.name,
  placeholder: x.symbol ?? '',
  cols: x?.cols ?? "12", sm: x?.sm ?? "6", md: x?.md ?? "4",
})))


</script>