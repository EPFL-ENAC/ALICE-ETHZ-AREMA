<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-black q-mb-lg">
      <q-btn
        flat
        icon="expand_more"
        size="48px"
        to="/purpose"
        class="text-grey-3 full-width q-pb-md"
      />
    </q-footer>
    <q-footer class="a-bg-orange text-orange-11">
      <q-toolbar>
        <q-btn
          flat
          dense
          size="lg"
          to="/purpose"
          class=""
          :label="$t('purpose')"
        />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts"></script>
