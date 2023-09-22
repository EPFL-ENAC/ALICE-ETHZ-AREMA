<template>
  <q-page class="row items-center justify-evenly">
    <example-component
      title="Example component"
      active
      :todos="todos"
      :meta="meta"
    ></example-component>
    <q-page>
      <q-btn
        color="primary"
        label="next scroll"
        @click="nextScroll()"
        />
      <div class="row">
        <pre>user: {{ user }}</pre>
      </div>
      <div class="row">
        <pre>we have {{ nr$.total }} naturalResources.</pre>
      </div>
      <div class="row">
        <pre>{{ nr$.data.map(x => x.id + x.name) }}</pre>
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
    content: 'ct1',
  },
  {
    id: 2,
    content: 'ct2',
  },
  {
    id: 3,
    content: 'ct3',
  },
  {
    id: 4,
    content: 'ct4',
  },
  {
    id: 5,
    content: 'ct5',
  },
]);
const meta = ref<Meta>({
  totalCount: 1200,
});

const auth = useAuthStore();
const { api } = useFeathers();

// https://feathers-pinia.pages.dev/services/use-find.html#usage
const pagination = { limit: ref(20), skip: ref(0) }
const params = computed(() => ({ query: {} }))
const nr$ = api.service('natural-resource').useFind(params, {
  pagination,
  paginateOn: 'hybrid'
})

api.service('natural-resource').on('created', (message) => {
  console.log('New natural-resource created', message)
  nr$.find();
})

api.service('natural-resource').on('deleted', (message) => {
  console.log('New natural-resource created', message)
  nr$.find();
})


const user = computed(() => auth.user);
// Combine the anonymous and authenticated channel
// const combinedChannel = api.channel('anonymous', 'authenticated')

// combinedChannel.addListener()
const nextScroll = async () => {
  await nr$.next()
}
</script>
