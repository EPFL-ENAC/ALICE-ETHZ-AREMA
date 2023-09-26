<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          {{ $t('main.brand') }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item>
          <q-chip>{{ authStore.user?.email }}</q-chip>
        </q-item>

        <q-item clickable v-close-popup @click="logout">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ $t('logout') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup :to="'/'">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ $t('dashboard') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item-label class="text-h6" header>{{ $t('content') }}</q-item-label>
        <q-item clickable v-close-popup :to="'/natural-resources'">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-gem" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ $t('natural_resources') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup :to="'/building-materials'">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-trowel-bricks" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ $t('building_materials') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup :to="'/building-elements'">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-door-closed" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ $t('building_elements') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup :to="'/buildings'">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-building" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ $t('buildings') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup :to="'/technical-constructions'">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-compass-drafting" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{
              $t('technical_constructions')
            }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup :to="'/professionals'">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-person-digging" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ $t('professionals') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item-section v-if="authStore.user?.role === 'admin'">
          <q-item-label class="text-h6" header>{{
            $t('administration')
          }}</q-item-label>

          <q-item clickable v-close-popup :to="'/users'">
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>
              <q-item-label header>{{ $t('users') }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-item-section>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  if (!authStore.isAuthenticated) {
    authStore.loginRedirect = router.currentRoute.value.fullPath;
    router.push('/login');
  }
});

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function logout() {
  authStore.logout().then(() => {
    router.push('/login');
  });
}
</script>
