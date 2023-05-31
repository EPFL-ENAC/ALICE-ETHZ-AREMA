<script setup lang='ts'>
import { ref } from 'vue'
import CircleMapInput from '~/components/CircleMapInput.vue'

const circle = ref({
  id: 'f3cb5b94f5ded23a10aed21038b72b29',
  type: 'Feature',
  properties: {
    circleRadius: 12,
  },
  geometry: {
    coordinates: [
      [
        [
          7.819782917575878,
          46.91568538815676,
        ],
        [
          7.819782917575878,
          46.91568538815676,
        ],
        [
          7.819782917575878,
          46.91568538815676,
        ],
        [
          7.819782917575878,
          46.91568538815676,
        ],
      ],
    ],
    type: 'Polygon',
  },
})
</script>

<template>
  <v-sheet>
    <v-row class="text-h4">CircleMapInput</v-row>
    <v-row>
      <v-col cols='9'>
        <CircleMapInput v-model="circle" height="800px"/>
      </v-col>
      <v-col cols='3'>
        <div class="text-h4">Model</div>
        <pre>
          {{ circle }}
        </pre>
      </v-col>
    </v-row>
  </v-sheet>
</template>
