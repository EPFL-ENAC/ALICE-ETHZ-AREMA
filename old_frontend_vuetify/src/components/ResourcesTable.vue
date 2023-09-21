<template>
  <v-sheet>
    <v-row>
      <h2>
        {{ title }}s
      </h2>
    </v-row>

    <v-row justify="end">
      <v-dialog v-model="dialog" persistent width="1024">
        <template v-slot:activator="{ props }">
          <v-btn color="primary" v-bind="props" @click="store.resetItem">
            Add new {{ title }}
          </v-btn>
        </template>
        <ResourcesCard :loading="loading" @update:dialog="toggleDialog" :headers="headers" :title="title"
          :modelValue="item" @update:modelValue="saveAndClose" @remove:image="deleteImageAndSave"/>
      </v-dialog>
    </v-row>
    <v-row justify="center" v-if="list">
      <v-data-table :loading="loading" v-model:items-per-page="itemsPerPage" :headers="tableHeaders" :items="list"
        class="elevation-1">
        <template v-for="(tableHeader, $tableHeaderIndex) in tableHeadersFiltered"
          #[`item.${tableHeader.key}`]="localCell" :key="$tableHeaderIndex">
          <div :key="$tableHeaderIndex" :class="tableHeader?.classFormatter(
            _get(localCell.item.raw, tableHeader.key),
            tableHeader,
            item
          )
            ">
            <span v-html="tableHeader?.formatter(
              _get(localCell.item.raw, tableHeader.key),
              tableHeader,
              localCell.item.raw,
              list
            )
              ">
            </span>
          </div>
        </template>
        <template #[`item.actions`]="localCell">
          <v-icon size="small" class="me-2" @click.stop="() => toggleDialogWithItemValue(localCell.item.raw, true)">
            mdi-pencil
          </v-icon>
          <v-icon size="small" @click="deleteItem(localCell.item.raw)">
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

<script setup lang="ts">
import { NaturalResource, RegenerativeMaterial, RegenerativeMaterialHeader } from "~/definitions/regenerativeMaterials";

import { storeToRefs, Store } from "pinia";

import { VDataTable, } from 'vuetify/labs/components'
import { get as _get } from "lodash";
import { ImageType } from "~/stores/common";
import { cloneDeep } from 'lodash';

const props = defineProps<{
  headers: RegenerativeMaterialHeader[],
  title: string,
  store: Store<string>,
}>()

// access the `store` variable anywhere in the component ✨
const { item, list, loading } = storeToRefs(props.store)
const headers = toRef(props, 'headers')
const dialog = ref(false);
let itemsPerPage = 20;

const tableHeaders: RegenerativeMaterialHeader[] = computed(() => {
  return headers.value.filter(
    (header: RegenerativeMaterialHeader) => !header.hideContentInTable
  );

});

const tableHeadersFiltered: RegenerativeMaterialHeader[] = computed(() => {
  return tableHeaders.value.filter(
    (header: RegenerativeMaterialHeader) => !header.hideFooterContent
  );

});


function toggleDialog(dialogValue: boolean) {
  dialog.value = dialogValue;
}

async function toggleDialogWithItemValue(value: NaturalResource, dialogValue: boolean) {
  // TODO: ad a loading so we can open the dialog asap
  await props.store.get(value.id)
  toggleDialog(dialogValue)
}

async function saveAndClose(localRef: RegenerativeMaterial) {
  await props.store.save(localRef)
  toggleDialog(false)
}

async function deleteImageAndSave(image: ImageType): void {
  item.value.images_uploaded = await props.store.removeAsset(image, item.value.images_uploaded)
  await props.store.save(item.value)
  // todo: display loading; and reload element after save.
  dialog.value = false; // closing for now
}
async function deleteItem(value: NaturalResource) {
  await props.store.remove(value);
}
async function fetchData() {
  await props.store.init()
  await props.store.getAll()
}
// // const router = useRouter()
const route = useRoute()
// watch the params of the route to fetch the data again
watch(
  () => route.params,
  fetchData,
  // fetch the data when the view is created and the data is
  // already being observed
  { immediate: true }
)

onBeforeUnmount(async () => {
  await props.store.close()
})


</script>