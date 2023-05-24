<template>
  <v-app id="inspire">
    <RootNavigationDrawer />

    <v-main font-sans class="m-10 ml-10" text="center gray-700 dark:gray-200">
    <RouterView />
    <TheFooter />
    </v-main>
  </v-app>
</template>
