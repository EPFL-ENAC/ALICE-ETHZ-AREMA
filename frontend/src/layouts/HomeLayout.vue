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
        to="/about"
        class="text-grey-3 full-width q-pb-md"
      />
    </q-footer>
    <q-footer class="bg-primary text-orange-11">
      <q-toolbar>
        <q-btn
          flat
          dense
          size="lg"
          to="/about"
          class=""
          :label="$t('purpose')"
        />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts"></script>
