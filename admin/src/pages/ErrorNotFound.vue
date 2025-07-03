<template>
  <div class="fullscreen bg-white text-grey-10 text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h4" style="opacity: 0.4">{{ t('error_not_found') }}</div>

      <q-btn
        class="q-mt-xl"
        color="grey-3"
        text-color="grey-10"
        unelevated
        to="/"
        :label="t('home')"
        no-caps
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>
