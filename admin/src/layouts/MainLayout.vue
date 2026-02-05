<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered class="bg-white text-grey-10">
      <q-toolbar v-if="isDevelopment" class="bg-warning">
        <div>
          <q-icon name="warning" class="on-left q-mb-xs" />Note: This is the
          <em>development</em> version of the <b>Atlas of Regenerative Materials</b>. If you are
          looking for the <em>production</em> version, please visit
          <a href="https://atlas-regenmat.ch/admin/" target="_blank" class="text-bold epfl"
            >atlas-regenmat.ch/admin <q-icon name="arrow_outward"
          /></a>
          instead.
        </div>
      </q-toolbar>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <img
          :src="
            $q.screen.gt.sm
              ? 'arema-h-1.svg'
              : $q.screen.gt.xs
                ? 'arema-h-sm.svg'
                : 'arema-h-xs.svg'
          "
          class="cursor-pointer"
          style="height: 25px"
          @click="router.push('/')"
        />
        <q-space />

        <q-btn-dropdown flat dense :label="locale" class="on-left">
          <q-list>
            <q-item
              clickable
              v-close-popup
              @click="onLocaleSelection(localeOpt)"
              v-for="localeOpt in localeOptions"
              :key="localeOpt.value"
            >
              <q-item-section>
                <q-item-label>{{ localeOpt.label }}</q-item-label>
              </q-item-section>
              <q-item-section avatar v-if="locale === localeOpt.value">
                <q-icon color="primary" name="check" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn-dropdown flat no-caps :label="username">
          <q-list>
            <q-item clickable v-close-popup @click="onLogout" v-if="authStore.isAuthenticated">
              <q-item-section avatar>
                <q-icon name="logout" size="xs" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ t('signout') }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item clickable v-close-popup :to="'/'">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ t('dashboard') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item-label class="text-h6" header>{{ t('content') }}</q-item-label>
        <q-item v-if="!authStore.isContributor" clickable v-close-popup :to="'/resources'">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-gem" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ t('natural_resources') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="!authStore.isContributor" clickable v-close-popup :to="'/building-materials'">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-memory" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ t('building_materials') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          v-if="!authStore.isContributor"
          clickable
          v-close-popup
          :to="'/construction-techniques'"
        >
          <q-item-section avatar>
            <q-icon name="fa-solid fa-trowel-bricks" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ t('technical_constructions') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup :to="'/buildings'">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-building" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ t('buildings') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup :to="'/professionals'">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-compass-drafting" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ t('professionals') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item-label v-if="authStore.isAdmin" class="text-h6" header>{{
          t('administration')
        }}</q-item-label>
        <q-item v-if="authStore.isAdmin" clickable :to="'/users'">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-users" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ t('users') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="authStore.isAdmin" clickable :to="'/authors'">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-copyright" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ t('authors') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item-label class="text-h6" header>{{ t('help') }}</q-item-label>
        <q-item clickable :to="'/publication'">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-upload" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ t('publication_flow') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable :to="'/layout'">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-newspaper" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ t('layout') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          v-close-popup
          @click="onOpenUrl('https://www.markdownguide.org/cheat-sheet/')"
        >
          <q-item-section avatar>
            <q-icon name="fa-brands fa-markdown" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ t('markdown_guide') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="showTermsDialog = true">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-gavel" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ t('terms_and_conditions') }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <markdown-dialog v-model="showTermsDialog" :text="terms" />
    </q-drawer>

    <login-dialog v-model="showLogin" />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import LoginDialog from 'src/components/LoginDialog.vue';
import MarkdownDialog from 'src/components/MarkdownDialog.vue';
import { isDevelopment } from 'src/boot/api';
import { Cookies } from 'quasar';
import { locales } from 'boot/i18n';

const { t, locale } = useI18n();
const $q = useQuasar();
const authStore = useAuthStore();
const router = useRouter();

const leftDrawerOpen = ref(false);
const showLogin = ref(false);
const showTermsDialog = ref(false);
const terms = ref('');

const username = computed(() => authStore.profile?.email);
const lang = computed(() => (locales.includes(locale.value) ? locale.value : 'en'));
const localeOptions = computed(() => {
  return locales.map((key: string) => ({
    label: key.toUpperCase(),
    value: key,
  }));
});

onMounted(() => {
  void authStore.init().then(() => {
    if (!authStore.isAuthenticated) {
      void router.push({ path: '/signin' });
    } else {
      void fetch(`/admin/help/${lang.value}/terms-conditions.md`).then((response) => {
        void response.text().then((text) => {
          terms.value = text;
        });
      });
    }
  });
});

watch(
  () => authStore.isAuthenticated,
  () => {
    if (!authStore.isAuthenticated) {
      void router.push({ path: '/signin' });
    }
  },
);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function onLogout() {
  void authStore.logout();
}

function onOpenUrl(url: string) {
  window.open(url, '_blank');
}

function onLocaleSelection(localeOpt: { label: string; value: string }) {
  locale.value = localeOpt.value;
  Cookies.set('locale', localeOpt.value);
}
</script>
