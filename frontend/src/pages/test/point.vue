<script setup lang='ts'>
import { ref } from 'vue'
import PointMapInput from '~/components/PointMapInput.vue'

const point = ref()
</script>

<template>
  <v-sheet>
    <v-row class="text-h4">PointMapInput</v-row>
    <v-row>
      <v-col cols='9'>
        <PointMapInput v-model="point" height="800px"/>
      </v-col>
      <v-col cols='3'>
        <div class="text-h4">Model</div>
        <pre class="text-left">
          {{ point }}
        </pre>
      </v-col>
    </v-row>
  </v-sheet>
</template>
