<template>
  <q-page class="q-pa-md a-bg-orange">
    <div class="text-h4 text-uppercase text-orange-11 q-mb-lg">
      {{ $t('purpose') }}
    </div>
    <div class="text-black" style="font-size: xx-large">
      {{ $t('purpose_text') }}
    </div>
    <div class="q-mt-lg">
      <vue-link
        to="/manifesto"
        class="text-uppercase"
        style="font-size: larger"
        >{{ $t('read_manifesto') }}</vue-link
      >
    </div>
  </q-page>
</template>

<script setup lang="ts"></script>
