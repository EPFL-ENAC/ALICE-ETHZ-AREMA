<template>
  <div>
    <q-btn
      :disable="home"
      to="/"
      no-caps
      :size="$q.screen.gt.sm ? '48px' : '36px'"
      :label="$t('home')"
      class="full-width"
      align="left"
    />
    <q-separator class="bg-primary" size="2px" />
    <div
      :style="`font-size: ${$q.screen.gt.sm ? 48 : 36}px; font-weight: 500; line-height: 1.715em`"
      class="q-ml-md q-pt-md"
    >
      {{ $t('atlas') }}
    </div>
    <div class="row q-mb-md q-ml-md">
      <q-btn no-caps size="xl" to="/about" :label="$t('about')" class="text-primary q-pl-none"></q-btn>
      <q-icon name="horizontal_rule" size="md" class="q-mt-md" />
      <q-btn no-caps size="xl" to="/contribute" :label="$t('contribute')" class="text-primary"></q-btn>
      <q-icon name="horizontal_rule" size="md" class="q-mt-md" />
      <q-btn no-caps size="xl" to="/search" :label="$t('search')" class="text-primary"></q-btn>
      <q-icon name="horizontal_rule" size="md" class="q-mt-md" />
      <q-btn no-caps size="xl" to="/videos" :label="$t('videos')" class="text-primary"></q-btn>
    </div>
    <q-separator class="bg-primary" size="2px" />
    <q-btn
      to="/contact"
      no-caps
      :size="$q.screen.gt.sm ? '48px' : '36px'"
      :label="$t('contact')"
      class="full-width"
      align="left"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  home?: boolean;
}
defineProps<Props>();

//function onAdmin() {
//  window.location.href = '/admin/';
//}
</script>
