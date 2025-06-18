<template>
  <q-page class="text-page q-pa-md bg-primary">
    <div class="text-black" style="font-size: x-large">
      <q-markdown :src="manifesto" no-heading-anchor-links />
      <q-markdown :src="who" no-heading-anchor-links />
      <q-markdown :src="support" no-heading-anchor-links />
      <q-markdown :src="inspiration" no-heading-anchor-links />
    </div>
  </q-page>
</template>

<script setup lang="ts">
const manifesto = ref('');
const who = ref('');
const support = ref('');
const inspiration = ref('');

onMounted(async () => {
  fetch('manifesto-en.md').then((response) => {
    response.text().then((text) => {
      manifesto.value = text;
    });
  });
  fetch('who-en.md').then((response) => {
    response.text().then((text) => {
      who.value = text;
    });
  });
  fetch('support-en.md').then((response) => {
    response.text().then((text) => {
      support.value = text;
    });
  });
  fetch('inspiration-en.md').then((response) => {
    response.text().then((text) => {
      inspiration.value = text;
    });
  });
});
</script>
