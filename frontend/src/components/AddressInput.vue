<script setup lang="ts">
import { computed, onMounted, ref, unref, watch } from 'vue'
import { geocoderApi } from '~/utils/geocoder'

const props = defineProps(['modelValue', 'center', 'zoom', 'height'])
const emit = defineEmits(['update:modelValue'])

const search = ref<string>()
const loading = ref<boolean>(false)

onMounted(() => {
  const feature = unref(props.modelValue)
  if (feature && feature.properties)
    search.value = feature.text
})

watch(search, async () => {
  if (search.value && search.value.length > 3) {
    loading.value = true
    geocoderApi.forwardGeocode({ query: search.value, limit: 1 }).then((collection) => {
      loading.value = false
      if (collection && collection.features && collection.features.length) {
        const value = collection.features.pop()
        emit('update:modelValue', value)
      }
      else {
        emit('update:modelValue', null)
      }
    })
  }
})

const nomalizedAddress = computed(() => {
  const feature = unref(props.modelValue)
  if (feature && feature.properties) {
    const name = feature.text
    const center = feature.center
    return `${name} [${center}]`
  }
  else {
    return null
  }
})
</script>

<template>
  <div>
    <v-row>
      <v-text-field
        v-model="search"
        :loading="loading"
        :label="$t('search')"
        prepend-inner-icon="mdi-magnify"
      />
    </v-row>
    <v-row class="">
      {{ nomalizedAddress }}
    </v-row>
  </div>
</template>
