<script setup lang='ts'>
import { toRef } from 'vue'
import type { ImageType } from '~/stores/common'

const props = defineProps<{
  modelValue: PropType<unknown>
}>()

const $emit = defineEmits<{
  (e: 'remove:image', value: ImageType): void
}>()

const images = toRef(props.modelValue)

function removeImage(image: ImageType): void {
  $emit('remove:image', image)
}

</script>

<template>
  <v-row>
    <v-col cols="12">
      <template v-for="image in images" :key="image.url">
        <v-card class="my-4" color="white">
          <v-row class="d-flex align-center">
            <!-- todo: move to modal -->
            <!-- thumbnail, name, input:image_type, input_description then edit/download/delete,-->
            <v-col>
              <v-avatar v-if="['Image', 'Drawing'].includes(image.type)" class="profile" color="grey" size="164" tile>
                <v-img :src="image.url"></v-img>
              </v-avatar>
              <v-avatar v-else class="profile" color="grey" size="164" tile>
                <v-card-title class="white--text">Thumbnail not available</v-card-title>
              </v-avatar>
            </v-col>
            <v-col>
              <!-- // TODO: allow user to remove images! -->
              <v-row class="row">
                <v-col class="d-flex justify-end">
                  <v-btn big :href="image?.origin_url ?? image?.url" target="_blank">download
                  </v-btn>
                  <v-btn class="mr-8" color="red" icon big @click="() => removeImage(image)">
                    x
                  </v-btn>
                </v-col>
              </v-row>

            </v-col>
          </v-row>
        </v-card>
      </template>
    </v-col>
  </v-row>
</template>
