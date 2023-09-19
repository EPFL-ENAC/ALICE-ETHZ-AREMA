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

        <q-item-label class="text-h6" header>{{ $t('content') }}</q-item-label>
        <q-item clickable v-close-popup :to="'/natural-resources'">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-gem" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ $t('natural_resources') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup :to="'/natural-resources'">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-building" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ $t('buildings') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup :to="'/natural-resources'">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-person-digging" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ $t('professionals') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item-label class="text-h6" header>{{
          $t('administration')
        }}</q-item-label>

        <q-item clickable v-close-popup :to="'/user'">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>{{ $t('users') }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  if (!authStore.isAuthenticated) {
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
