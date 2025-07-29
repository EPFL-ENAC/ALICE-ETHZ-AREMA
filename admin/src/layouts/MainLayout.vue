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

        <q-toolbar-title>
          {{ t('main.brand') }}
        </q-toolbar-title>

        <q-btn-dropdown flat no-caps :label="username">
          <q-list>
            <q-item clickable v-close-popup @click="onLogout" v-if="authStore.isAuthenticated">
              <q-item-section avatar>
                <q-icon name="logout" size="xs" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ t('logout') }}</q-item-label>
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
        <q-item clickable v-close-popup :to="'/resources'">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-gem" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ t('natural_resources') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup :to="'/building-materials'">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-memory" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ t('building_materials') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup :to="'/construction-techniques'">
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

        <q-item-label class="text-h6" header>{{ t('help') }}</q-item-label>
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
      </q-list>
    </q-drawer>

    <login-dialog v-model="showLogin" />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import LoginDialog from 'src/components/LoginDialog.vue';
import { isDevelopment } from 'src/boot/api';

const { t } = useI18n();
const authStore = useAuthStore();

const leftDrawerOpen = ref(false);
const showLogin = ref(false);

const username = computed(() => authStore.profile?.email);

onMounted(() => {
  void authStore
    .init()
    .then(() => {
      if (!authStore.isAuthenticated) {
        showLogin.value = true;
      }
    })
    .catch((error) => {
      console.error('Error initializing auth store:', error);
      onLogout();
    });
});

watch(
  () => authStore.isAuthenticated,
  () => {
    if (!authStore.isAuthenticated) {
      showLogin.value = true;
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
</script>
