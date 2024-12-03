<template>
  <div>
    <q-btn
      to="/"
      no-caps
      size="48px"
      :label="$t('home')"
      class="full-width"
      align="left"
    />
    <q-separator class="bg-primary" size="2px" />
    <div
      style="font-size: 48px; font-weight: 500; line-height: 1.715em"
      class="q-ml-md q-pt-md"
    >
      {{ $t('atlas') }}
    </div>
    <div class="row q-mb-md">
      <q-btn
        no-caps
        size="xl"
        to="/about"
        :label="$t('about')"
        class="text-primary"
      ></q-btn>
      <q-icon name="horizontal_rule" size="md" class="q-mt-md" />
      <q-btn
        no-caps
        size="xl"
        to="/contribute"
        :label="$t('contribute')"
        class="text-primary"
      ></q-btn>
      <q-icon name="horizontal_rule" size="md" class="q-mt-md" />
      <q-btn
        no-caps
        size="xl"
        to="/resosurces"
        :label="$t('resources')"
        class="text-primary"
      ></q-btn>
      <q-icon name="horizontal_rule" size="md" class="q-mt-md" />
      <q-btn
        no-caps
        size="xl"
        to="/search"
        :label="$t('search')"
        class="text-primary"
      ></q-btn>
      <q-icon name="horizontal_rule" size="md" class="q-mt-md" />
      <q-btn
        no-caps
        size="xl"
        to="/videos"
        :label="$t('videos')"
        class="text-primary"
      ></q-btn>
    </div>
    <q-separator class="bg-primary" size="2px" />
    <q-btn
      to="/contact"
      no-caps
      size="48px"
      :label="$t('contact')"
      class="full-width"
      align="left"
    />
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'NavDrawer',
});
</script>
<script setup lang="ts"></script>
