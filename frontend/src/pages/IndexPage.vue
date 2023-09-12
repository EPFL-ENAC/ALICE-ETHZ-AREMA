<template>
  <q-page class="row items-center justify-evenly">
    <example-component
      title="Example component"
      active
      :todos="todos"
      :meta="meta"
    ></example-component>
    <q-page>
    <div class="row">
      <pre>user: {{ user }}</pre>
    </div>
    <div class="row">
      <pre>we have {{ total }} naturalResources.</pre>
    </div>
    <div class="row">
      <pre>{{ naturalResources }}</pre>
    </div>
  </q-page>
  </q-page>
</template>

<script setup lang="ts">
import { Todo, Meta } from 'components/models';
import ExampleComponent from 'components/ExampleComponent.vue';
import { ref } from 'vue';

const todos = ref<Todo[]>([
  {
    id: 1,
    content: 'ct1'
  },
  {
    id: 2,
    content: 'ct2'
  },
  {
    id: 3,
    content: 'ct3'
  },
  {
    id: 4,
    content: 'ct4'
  },
  {
    id: 5,
    content: 'ct5'
  }
]);
const meta = ref<Meta>({
  totalCount: 1200
});

const auth = useAuthStore()
const { api } = useFeathers()
const NaturalResource = api.service('natural-resource')

const user = computed(() => auth.user)
const messageParams = computed(() => {
  return { query: {} }
})

const { total } = NaturalResource.useFind(messageParams, { paginateOnServer: true, immediate: true })
const naturalResources = computed(() => NaturalResource.findInStore({ query: {} }).data.value.reverse())

</script>
