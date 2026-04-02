<template>
  <div>
    <q-btn
      :disable="home"
      to="/"
      no-caps
      :size="$q.screen.gt.sm ? '48px' : '36px'"
      :label="t('home')"
      class="full-width"
      align="left"
    />
    <q-separator class="bg-primary" size="2px" />
    <div
      :style="`font-size: ${$q.screen.gt.sm ? 48 : 36}px; font-weight: 500; line-height: 1.715em`"
      class="q-ml-md q-pt-md"
    >
      {{ t('atlas') }}
    </div>
    <div class="q-mb-md q-ml-md">
      <div>
        <q-btn
          no-caps
          size="xl"
          to="/manifesto"
          :label="t('manifesto')"
          class="text-primary q-pa-none"
        ></q-btn>
      </div>
      <div>
        <q-btn
          no-caps
          size="xl"
          to="/about"
          :label="t('about')"
          class="text-primary q-pa-none"
        ></q-btn>
      </div>
      <div>
        <q-btn
          no-caps
          size="xl"
          to="/contribute"
          :label="t('contribute')"
          class="text-primary q-pa-none"
        ></q-btn>
      </div>
    </div>
    <q-separator class="bg-primary" size="2px" />
    <div
      :style="`font-size: ${$q.screen.gt.sm ? 48 : 36}px; font-weight: 500; line-height: 1.715em`"
      class="q-ml-md q-pt-md"
    >
      {{ t('documentation') }}
    </div>
    <div class="q-mb-md q-ml-md">
      <div>
        <q-btn
          no-caps
          size="xl"
          to="/search"
          :label="t('search')"
          class="text-primary q-pa-none"
        ></q-btn>
      </div>
      <div>
        <q-btn
          no-caps
          size="xl"
          to="/videos"
          :label="t('videos')"
          class="text-primary q-pa-none"
        ></q-btn>
      </div>
      <div>
        <q-btn
          no-caps
          size="xl"
          href="https://www.regenerativematerials.org/library"
          target="_blank"
          :label="t('library')"
          class="text-primary q-pa-none"
        ></q-btn>
      </div>
    </div>
    <q-separator class="bg-primary" size="2px" />
    <q-btn
      to="/contact"
      no-caps
      :size="$q.screen.gt.sm ? '48px' : '36px'"
      :label="t('contact')"
      class="full-width"
      align="left"
    />
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

interface Props {
  home?: boolean;
}
defineProps<Props>();

const { t } = useI18n();
const $q = useQuasar();

//function onAdmin() {
//  window.location.href = '/admin/';
//}
</script>
