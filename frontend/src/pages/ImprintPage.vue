<template>
  <q-page class="q-pa-md bg-primary">
    <div class="text-h4 text-uppercase text-secondary q-mb-lg">
      {{ $t('imprint') }}
    </div>
    <div class="text-black" style="font-size: x-large">
      <q-markdown :src="content" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
const content = ref('');

onMounted(async () => {
  fetch('imprint.md').then((response) => {
    response.text().then((text) => {
      content.value = text;
    });
  });
});
</script>
