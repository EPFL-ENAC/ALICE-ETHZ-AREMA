<template>
    <v-navigation-drawer
      model-value
      class="pt-4"
      color="grey-lighten-3"
      rail
    >
      <v-avatar
        v-for="(route, $key) in routes"
        :key="$key"
        :color="`grey-${$key === 1 ? 'darken' : 'lighten'}-1`"
        :size="$key === 1 ? 36 : 20"
        class="d-block text-center mx-auto mb-9"
      >
      <router-link :to="{name: route.path}">{{ route.name }}</router-link>
      </v-avatar>
    </v-navigation-drawer>
</template>

<script setup lang="ts">

const routes = [{
  path: 'index',
  name: 'Home',
},{
  path: 'natural_resources',
  name: 'Natural resources',
},{
  path: 'building_materials',
  name: 'Building materials',
},{
  path: 'professionals',
  name: 'Professionals',
},{
  path: 'test',
  name: 'Test',
}
// ,{
//   path: 'building_material',
//   name: 'Building Material',
// }
]


</script>
