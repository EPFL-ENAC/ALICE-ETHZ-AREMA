<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="text-h5 text-uppercase text-primary">
      {{ $t('filters') }}
    </div>
    <q-separator size="2px" class="bg-primary q-mt-md q-mb-md" />
    <q-input
      v-model="search"
      borderless
      input-style="font-size: 48px;"
      input-class="text-secondary"
      :placeholder="$t('type_here')"
      class="q-mt-md q-mb-md"
    />
    <q-separator size="2px" class="bg-primary q-mt-md q-mb-md" />
    <div>
      <q-btn
        v-for="filter in filters"
        :key="filter"
        :outline="filter !== selectedFilter"
        color="primary"
        unelevated
        square
        no-caps
        size="md"
        :label="$t(filter)"
        class="on-left"
        @click="onFilterSelect(filter)"
      />
    </div>
    <div class="q-mt-md"></div>
    <div class="q-mt-md">
      <q-btn
        v-for="view in views"
        :key="view"
        :outline="view !== selectedView"
        color="secondary"
        unelevated
        square
        no-caps
        size="md"
        :label="$t(view)"
        class="on-left"
        @click="onViewSelect(view)"
      />
    </div>
    <q-separator size="2px" class="bg-primary q-mt-md q-mb-md" />
  </q-page>
</template>

<script setup lang="ts">
const search = ref('');
const selectedFilter = ref('material');
const selectedView = ref('map');

const filters = ['material', 'professional'];
const views = ['map', 'list'];

function onFilterSelect(filter: string) {
  selectedFilter.value = filter;
}

function onViewSelect(view: string) {
  selectedView.value = view;
}
</script>
