<template>
  <div>
    <div class="text-h5 text-uppercase text-secondary q-mb-lg">
      {{ $t('purpose') }}
    </div>
    <div class="text-black" :style="$q.screen.gt.xs ? 'font-size: xx-large' : ''">
      <span v-html="$t('purpose_text')"></span>
    </div>
    <div class="q-mt-lg">
      <router-link to="/about" class="text-uppercase" style="font-size: larger"
        >{{ $t('read_manifesto') }} <q-icon name="open_in_new"
      /></router-link>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
