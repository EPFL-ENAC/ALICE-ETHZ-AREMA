<template>
  <q-page class="text-page q-pa-md bg-primary">
    <div class="text-black" style="font-size: x-large">
      <q-markdown :src="manifesto" no-heading-anchor-links />
    </div>
  </q-page>
</template>

<script setup lang="ts">
const manifesto = ref('');

onMounted(() => {
  void fetch('manifesto-en.md').then((response) => {
    void response.text().then((text) => {
      manifesto.value = text;
    });
  });
});
</script>
