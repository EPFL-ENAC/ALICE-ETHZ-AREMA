<template>
  <q-page class="text-page q-pa-md bg-primary">
    <div class="text-black" style="font-size: x-large">
      <q-markdown :src="content" no-heading-anchor-links />
    </div>
  </q-page>
</template>

<script setup lang="ts">
const content = ref('');

onMounted(async () => {
  fetch('contribute-en.md').then((response) => {
    response.text().then((text) => {
      content.value = text;
    });
  });
});
</script>
