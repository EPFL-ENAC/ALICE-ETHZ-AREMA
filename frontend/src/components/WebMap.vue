<script setup lang='ts'>
import { computed, ref } from 'vue'
import MapView from '~/components/MapView.vue'

const props = defineProps(['modelValue', 'center', 'zoom'])
const emit = defineEmits(['update:modelValue'])

const mapView = ref<InstanceType<typeof MapView>>()

const localModelValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>

<template>
  <v-row>
    <v-col cols='12'>
      <MapView
        ref='mapView'
        v-model="localModelValue"
        :center="center"
        :zoom="zoom"
      />
    </v-col>
  </v-row>
</template>
