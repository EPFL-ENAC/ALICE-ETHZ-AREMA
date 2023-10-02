<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-12">
      <q-carousel
        animated
        v-model="slide"
        navigation
        infinite
        :autoplay="autoplay"
        arrows
        transition-prev="slide-right"
        transition-next="slide-left"
        @mouseenter="autoplay = false"
        @mouseleave="autoplay = true"
        style="height: 600px"
      >
        <q-carousel-slide :name="1" img-src="building-architecture-wood.jpg">
          <div class="row q-pa-lg q-mt-md">
            <div class="col"></div>
            <div class="col-md-6 col-sm-8 col-xs-12">
              <div class="text-h2 text-weight-thin text-white">
                Regenerative Materials
              </div>
              <div class="text-subtitle1 text-white">
                Buildings, building elements, professionals...
              </div>
            </div>
            <div class="col"></div>
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="2" img-src="crop-field.jpg">
          <div class="text-h2 text-weight-thin text-white">
            Regenerative Materials
          </div>
          <div class="text-subtitle1 text-white">
            Natural resources, building materials...
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
    <div class="col-12 q-pa-xl">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <q-card>
            <a href="/search?type=professional">
              <q-img src="wood-work.jpg" height="250px" />
            </a>
            <q-card-section>
              <div class="text-h6">Professionals</div>
              <div class="text-subtitle2">...</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-4">
          <q-card>
            <a href="/search?type=building">
              <q-img src="chaux.jpg" height="250px" />
            </a>
            <q-card-section>
              <div class="text-h6">Buildings</div>
              <div class="text-subtitle2">...</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-4">
          <q-card>
            <a href="/search?type=natural-resource">
              <q-img src="granite.jpg" height="250px" />
            </a>
            <q-card-section>
              <div class="text-h6">Natural Resources</div>
              <div class="text-subtitle2">...</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="row q-mt-xl">
        <div class="col-12 fit row justify-center">
          <q-btn
            label="More resources"
            size="xl"
            class=""
            to="/search"
            no-caps
          />
        </div>
      </div>
    </div>
    <div class="col-12 q-pa-xl bg-grey-4">
      <div class="text-h2 text-weight-thin q-mb-lg">Maps</div>
      <div class="text-body1 q-mb-md">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam, porro
        beatae alias repudiandae nobis officiis amet a veniam nihil accusantium
        ducimus dicta sint totam. Alias, in. Enim illo ad tempore.
      </div>
      <div>
        <q-img src="maps.png" />
      </div>
    </div>
    <div class="col-12 q-pa-xl">
      <div class="text-h2 text-weight-thin q-mb-lg">About</div>
      <div class="text-body1">
        The construction sector's greenhouse gas emissions require urgent
        development of low-carbon building solutions. Regenerative Materials
        enable immediate CO2 reduction and a digital platform is needed for
        accessible knowledge exchange. The proposed platform will gather and
        curate research results from academia and industry, with a focus on
        promoting Sustainable Development Goals.
      </div>
    </div>
    <div class="col-12 q-pa-xl bg-grey-4">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <q-img
            src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-black.svg"
            width="100px"
          />
          <span class="text-h6 on-right">AREMA</span>
        </div>
        <div class="col-12 col-md-4">
          <div class="text-overline">Legal mentions</div>
          <div class="text-body2">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
            blanditiis tenetur unde suscipit, quam beatae rerum inventore
            consectetur, neque doloribus, cupiditate numquam dignissimos laborum
            fugiat deleniti? Eum quasi quidem quibusdam.
          </div>
          <div class="text-overline q-mt-md">Copyright</div>
          <div class="text-body2">In shoshana we trust.</div>
        </div>
        <div class="col-12 col-md-4">
          <div class="text-overline">Contact</div>
          <div class="text-body2">
            Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore
            consectetur, neque doloribus, cupiditate numquam dignissimos laborum
            fugiat deleniti? Eum quasi quidem quibusdam.
          </div>
          <div class="text-overline q-mt-md">Administration</div>
          <div class="text-body2">
            <a href="/admin">Sign-in</a>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 q-pa-xl">
      <div class="row q-col-gutter-md">
        <div v-for="image in images" :key="image" class="col-6 col-md-2">
          <q-img :src="image" width="100px" />
        </div>
      </div>
    </div>
    <div class="col-12 q-pa-xl" style="display: none">
      <q-btn color="primary" label="next scroll" @click="nextScroll()" />
      <div class="row">
        <pre>user: {{ user }}</pre>
      </div>
      <div class="row">
        <pre>we have {{ nr$.total }} naturalResources.</pre>
      </div>
      <div class="row">
        <pre>{{ nr$.data.map((x) => x.id + x.name) }}</pre>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const slide = ref(1);
const autoplay = ref(true);

const images = [
  'ALICE.png',
  'CIRKLA.png',
  'EPFL.png',
  'EthZurich.png',
  'FGS.png',
  'IGP.png',
  'LUMA.png',
  'MATERIALARCHIV.png',
  'MATERIAUTHEQUE.png',
  'Opalis.png',
  'ROTOR_DC.png',
  'SUPSI.png',
];

const auth = useAuthStore();
const { api } = useFeathers();

// https://feathers-pinia.pages.dev/services/use-find.html#usage
const pagination = { limit: ref(20), skip: ref(0) };
const params = computed(() => ({ query: {} }));
const nr$ = api.service('natural-resource').useFind(params, {
  pagination,
  paginateOn: 'hybrid',
});

api.service('natural-resource').on('created', (message) => {
  console.log('New natural-resource created', message);
  nr$.find();
});

api.service('natural-resource').on('deleted', (message) => {
  console.log('New natural-resource created', message);
  nr$.find();
});

const user = computed(() => auth.user);
// Combine the anonymous and authenticated channel
// const combinedChannel = api.channel('anonymous', 'authenticated')

// combinedChannel.addListener()
const nextScroll = async () => {
  await nr$.next();
};
</script>
