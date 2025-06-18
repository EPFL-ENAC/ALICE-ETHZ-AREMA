<template>
  <q-page class="q-pa-md bg-primary">
    <div class="text-h4 text-uppercase text-secondary q-mb-lg">
      {{ $t('copyright') }}
    </div>
    <div class="text-black" style="font-size: x-large">
      <q-markdown :src="content" no-heading-anchor-links />
    </div>
  </q-page>
</template>

<script setup lang="ts">
const content = ref('');

onMounted(async () => {
  fetch('copyright-en.md').then((response) => {
    response.text().then((text) => {
      content.value = text;
    });
  });
});
</script>
