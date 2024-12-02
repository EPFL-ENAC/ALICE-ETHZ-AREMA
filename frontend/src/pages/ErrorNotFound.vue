<template>
  <div
    class="fullscreen bg-primary text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.6">
        {{ $t('page_not_found') }}
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="grey"
        unelevated
        square
        :label="$t('go_back')"
        no-caps
        @click="router.go(-1)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
</script>
