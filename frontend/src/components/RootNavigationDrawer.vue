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
    :color="`grey-${$route.name?.valueOf() == route.pathName ? 'darken' : 'lighten'}-1`"
    :size="$route.name?.valueOf() == route.pathName ? 36 : 20"
    class="d-block text-center mx-auto mb-9"
    >
     
      <router-link :to="{name: route.pathName}">{{ route.name[0] }}</router-link>
      </v-avatar>
    </v-navigation-drawer>
</template>

<script setup lang="ts">

const routes = [{
  pathName: 'index',
  name: 'IndexPage',
},{
  pathName: 'natural_resources',
  name: 'Natural resources',
},{
  pathName: 'building_materials',
  name: 'Building materials',
}
,{
  pathName: 'technical_constructions',
  name: 'Technical constructions',
},{
  pathName: 'professionals',
  name: 'Professionals',
},{
  pathName: 'buildings',
  name: 'Buildings',
},{
  pathName: 'test',
  name: 'Test',
}
// ,{
//   path: 'building_material',
//   name: 'Building Material',
// }
]


</script>
