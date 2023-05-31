<script setup lang='ts'>
import MapInput from '~/components/MapInput.vue'
import {
  type Feature,
  type MultiPolygon,
  type Polygon,
} from '@turf/turf'
import { ref, watch, onMounted, unref } from 'vue'

const props = defineProps(['modelValue', 'center', 'zoom'])
const emit = defineEmits(['update:modelValue'])

const mapInput = ref<InstanceType<typeof MapInput>>()

const selectedFeatures = ref<Feature<Polygon | MultiPolygon>[]>([])

onMounted(() => {
  mapInput.value?.drawFeature(unref(props.modelValue))
})

watch(selectedFeatures, async () => {
  if (selectedFeatures.value && selectedFeatures.value.length > 0) {
    const value = selectedFeatures.value.pop()
    emit('update:modelValue', value)
  }
  else {
    emit('update:modelValue', null)
  }
})

function edit() {
  mapInput.value?.deleteAll()
  mapInput.value?.drawCircle()
}
</script>

<template>
  <v-row>
    <v-col cols='12'>
      <v-btn
        class="ma-3"
        color="primary"
        @click='edit()'
      >
        {{ $t('draw.circle') }}
      </v-btn>
      <v-btn
        class="ma-3"
        color="primary"
        v-if='modelValue'
        @click='mapInput?.deleteAll()'
      >
        {{ $t('draw.trash') }}
      </v-btn>
      <MapInput
        ref='mapInput'
        :center='center'
        :zoom='zoom'
        @update:selected-features='selectedFeatures = $event'
      />
    </v-col>
  </v-row>
</template>
