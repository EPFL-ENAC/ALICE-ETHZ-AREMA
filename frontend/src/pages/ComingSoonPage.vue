<template>
  <q-page>
    <div class="row items-center justify-evenly bg-black" style="height: 100vh">
      <img src="arema-1.svg" style="filter: invert(100%); width: 80%" />
      <div
        class="text-primary q-pa-md"
        :class="$q.screen.gt.sm ? 'text-h3' : 'text-h5'"
        style="width: 80%"
      >
        Coming soon on 27.6
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
const $q = useQuasar();
</script>
