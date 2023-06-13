<script setup lang='ts'>
import { ref } from 'vue'
import AddressInput from '~/components/AddressInput.vue'

const feature = ref()
</script>

<template>
  <v-sheet>
    <v-row class="text-h4">AddressInput</v-row>
    <v-row>
      <v-col cols='9'>
        <AddressInput v-model="feature" height="800px"/>
      </v-col>
      <v-col cols='3'>
        <div class="text-h4">Model</div>
        <pre class="text-left">
          {{ feature }}
        </pre>
      </v-col>
    </v-row>
  </v-sheet>
</template>
