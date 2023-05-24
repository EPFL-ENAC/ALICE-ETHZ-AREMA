<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">Natural resource</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <!-- <v-row>
          {{ naturalResource }}
        </v-row> -->
        <v-row>
          <v-col v-for="(header) in naturalResourceHeader" v-bind="header">
            <component :is="header.component" v-bind="header" v-if="header.type === 'number'"
              v-model.number="naturalResource[header.name]" />
            <component :is="header.component" v-bind="header" v-else v-model="naturalResource[header.name]" />
          </v-col>
          <!-- <v-col cols="12" sm="6" md="4">
            <v-text-field label="Legal first name*" required></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field label="Legal middle name" hint="example of helper text only on focus"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field label="Legal last name*" hint="example of persistent helper text" persistent-hint
              required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field label="Email*" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field label="Password*" type="password" required></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-select :items="['0-17', '18-29', '30-54', '54+']" label="Age*" required></v-select>
          </v-col>
          <v-col cols="12" sm="6">
            <v-autocomplete
              :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
              label="Interests" multiple></v-autocomplete>
          </v-col> -->
        </v-row>
      </v-container>
      <small>*indicates required field</small>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue-darken-1" variant="text" @click="closeDialog">
        Close
      </v-btn>
      <v-btn color="blue-darken-1" variant="text" @click="save">
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">

import { storeToRefs } from "pinia";
import { ref } from "vue";
import { NaturalResource, NaturalResourceHeader } from '~/definitions/naturalResources';
import { useNaturalResourceStore } from '~/stores/naturalResource';

// access the `store` variable anywhere in the component ✨
const store = useNaturalResourceStore()
const { naturalResource } = storeToRefs(store)

defineProps<{
  naturalResourceHeader: NaturalResourceHeader[]
}>()


// type-based
const $emit = defineEmits<{
  (e: 'update:dialog', value: boolean): void
}>()

const closeDialog = () => {
  $emit('update:dialog', false)
}


const save = async () => {
  await store.save(naturalResource.value);
  closeDialog();
}

</script>