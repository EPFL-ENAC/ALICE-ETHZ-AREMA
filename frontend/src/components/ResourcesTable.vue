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
          <v-btn color="primary" v-bind="props">
            Add new {{ title }}
          </v-btn>
        </template>
        <ResourcesCard @update:dialog="updateDialog" :headers="tableHeaders" :title="title" :modelValue="item"
          @update:modelValue="store.save" />
      </v-dialog>
    </v-row>
    <v-row justify="center" v-if="list">
      <v-data-table :loading="loading" v-model:items-per-page="itemsPerPage" :headers="headers" :items="list"
        class="elevation-1">
        <template v-for="(tableHeader, $tableHeaderIndex) in tableHeaders" #[`item.${tableHeader.key}`]="localCell"
          :key="$tableHeaderIndex">
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
        <template  #[`item.actions`]="localCell">
          slot actions{{   }}
          <v-icon size="small" class="me-2" @click.stop="() => openDialog(localCell.item.raw, 'item-dialog')">
            mdi-pencil
          </v-icon>
          <v-icon size="small" @click="deleteItem(localCell.item.raw, 'delete-item')">
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
import { NaturalResource, RegenerativeMaterialHeader } from "~/definitions/regenerativeMaterials";

import { storeToRefs, Store } from "pinia";

import { VDataTable, } from 'vuetify/labs/components'
import { get as _get } from "lodash";

const props = defineProps<{
  headers: RegenerativeMaterialHeader[],
  title: string,
  store: Store<string>,
}>()

// access the `store` variable anywhere in the component ✨
const { item, list, loading } = storeToRefs(props.store)
const headers = toRef(props, 'headers')
const dialog = ref(false);
const itemsPerPage = 20;

const tableHeaders: RegenerativeMaterialHeader[] = computed(() => {

  return headers.value.filter(
      (header: RegenerativeMaterialHeader) => header.hideFooterContent
    );

});

async function updateDialog(e: boolean) {
  loading.value = true;
  dialog.value = e;
  item.value = props.store.getNew();
  loading.value = false;

}
async function openDialog(value: NaturalResource, name: string) {
  dialog.value = true;
  item.value = value;
}

async function deleteItem(value: NaturalResource) {
  await props.store.remove(value);
}
onMounted(async () => {
  await props.store.init()
  await props.store.getAll()
});

onBeforeUnmount(async () => {
  await props.store.close()
})


</script>