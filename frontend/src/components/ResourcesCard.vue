<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">{{ title }}</span>
    </v-card-title>
    <v-form @submit.prevent="() => save(item)" v-model="formValid">
      <v-card-text>
        <v-container>
          <v-row>
            <v-col v-for="(header) in headers" v-bind="header">
              <template v-if="!header.hideInput">
                <component :is="header.component" v-bind="header" v-if="header.type === 'number'"
                  v-model.number="item[header.key]" />
                <component :is="header.component" v-bind="header" v-else v-model="item[header.key]" />
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
        <v-btn color="blue-darken-1" variant="text" type="submit">
          Save
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { RegenerativeMaterialHeader } from "~/definitions/regenerativeMaterials";
import { cloneDeep } from 'lodash';
const props = defineProps<{
  headers: RegenerativeMaterialHeader[],
  title: string,
  modelValue: PropType<unknown>,
}>()

const item = toRef(cloneDeep(props.modelValue))
const formValid = toRef(false)
// type-based
const $emit = defineEmits<{
  (e: 'update:dialog', value: boolean): void,
  (e: 'update:modelValue', value: any): void
}>()

const closeDialog = () => {
  $emit('update:dialog', false)
}


const save = async (item: unknown) => {
  $emit('update:modelValue', item)
  closeDialog()
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