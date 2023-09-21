<template>
  <v-card :loading="props.loading">
    <v-card-title>
      <span class="text-h5">{{ title }}</span>
    </v-card-title>
    <v-form @submit.prevent="() => save(item)" v-model="formValid" :disabled="props.loading">
      <v-card-text>
        <v-container>
          <v-row>
            <v-col v-for="(header) in headers" v-bind="header">
              <template v-if="!header.hideInput">
                <component :is="header.component" v-bind="toHeader(header)" v-if="header.type === 'number'"
                  v-model.number="item[header.key]"/>
                <component :is="header.component" v-bind="toHeader(header)" v-else v-model="item[header.key]"
                  @remove:image="(image: ImageType) => $emit('remove:image', image)"/>
              </template>
            </v-col>
          </v-row>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="closeDialog">
          Close
        </v-btn>
        <v-btn color="blue-darken-1" variant="text" type="submit" :disabled="props.loading">
          Save
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { RegenerativeMaterial, RegenerativeMaterialHeader } from "~/definitions/regenerativeMaterials";
import { cloneDeep } from 'lodash';
import { useI18n } from 'vue-i18n';
import { ImageType } from '~/stores/common';

const { t } = useI18n()

const props = defineProps<{
  headers: RegenerativeMaterialHeader[],
  title: string,
  modelValue: PropType<RegenerativeMaterial>,
  loading: boolean,
}>()

const item = toRef(cloneDeep(props.modelValue))
const formValid = toRef(false)
// type-based
const $emit = defineEmits<{
  (e: 'update:dialog', value: boolean): void,
  (e: 'update:modelValue', value: any): void,
  (e: 'remove:image', value: ImageType): void
}>()

// header preprocessing
const toHeader = (header: RegenerativeMaterialHeader) => {
  const h = cloneDeep(header)
  // translate header text
  h.text = t(h.text)
  // https://github.com/vuetifyjs/vuetify/issues/15688
  if (h.type === 'number')
    delete h.type
  return h
}

const closeDialog = () => {
  $emit('update:dialog', false)
}

const save = () => {
  $emit('update:modelValue', item.value)
}

// TODO: implement disabled if 
// :disabled="
//                       header.disabled ||
//                       item?.[header.disabledWithConditions]
//                     "
// TODO: implement customFormInput if time allowed
//               @input="(v) => customFormInput(v, header, item)"

// conts customFormInput = (
//     v: SurveyInputValue,
//     surveyItem: SurveyTableHeader,
//     localInput: SurveyInput
// ): void => {
//     const newLocalInput = (surveyItem?.customEventInput?.(
//       v,
//       localInput,
//     ) ?? cloneDeep(localInput)) as SurveyInput;
//     newLocalInput[surveyItem.key] = v;
//     this.localInput = newLocalInput;
//     this.refreshKey = this.refreshKey + 1;
//   }

</script>

<style>
.v-card .v-card-title {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 10000;
}
.v-card .v-card-actions {
  position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 10000;
}
</style>