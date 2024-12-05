<template>
  <div class="q-pa-md bg-primary">
    <div class="text-h4 text-uppercase text-secondary q-mb-lg">
      {{ $t('purpose') }}
    </div>
    <div class="text-black" style="font-size: xx-large">
      <span v-html="$t('purpose_text')"></span>
    </div>
    <div class="q-mt-lg">
      <router-link
        to="/manifesto"
        class="text-uppercase"
        style="font-size: larger"
        >{{ $t('read_manifesto') }} <q-icon name="open_in_new"
      /></router-link>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'AboutPanel',
});
</script>
<script setup lang="ts"></script>
