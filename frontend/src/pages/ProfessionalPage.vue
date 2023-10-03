<template>
  <q-page>
    <div class="row q-pa-lg q-mt-md">
      <div class="col"></div>
      <div class="col-md-6 col-sm-8 col-xs-12">
        <div class="text-h4 text-weight-thin q-mb-lg">
          Professional ::: {{ entity?.name }}
        </div>
        <div>
          <q-chip v-if="entity?.professionalType">{{
            entity?.professionalType?.text
          }}</q-chip>
          <q-chip
            v-for="tag in entity?.tags"
            :key="tag"
            :label="tag"
            color="amber"
            text-color="grey-10"
            class="q-mr-sm q-mb-sm"
          />
        </div>
        <q-card flat class="text-body1 bg-grey-2 q-mt-md">
          <q-card-section>
            <div v-html="description" class="marked"></div>
          </q-card-section>
        </q-card>
        <div class="text-body1 q-mt-md">
          <q-icon name="map" class="on-left" />
          {{ entity?.address }}
        </div>
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="text-body1 q-mt-md">
              <q-icon name="email" class="on-left" />
              <a :href="`mailto:${entity?.email}`">{{ entity?.email }}</a>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-body1 q-mt-md">
              <q-icon name="launch" class="on-left" />
              <a :href="`${entity?.web}`" target="_blank">{{ entity?.web }}</a>
            </div>
          </div>
        </div>
        <div class="q-mt-md">
          <q-carousel animated v-model="slide" arrows infinite thumbnails>
            <q-carousel-slide :name="1" img-src="/faker/slope9.jpg" />
            <q-carousel-slide
              :name="2"
              img-src="/faker/27_2b-architectes_Maison-BB-ph-Mathieu-Gafsou_full.jpg"
            />
          </q-carousel>
        </div>
        <div class="text-h6 q-mt-md">More...</div>
        <div v-if="entity?.professionalType" class="text-body1 q-mt-md">
          <a
            :href="`/search?q=professional&type=${entity?.professionalTypeId}`"
          >
            <q-icon name="search" /> {{ entity?.professionalType?.text }}</a
          >
        </div>
      </div>
      <div class="col"></div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { Professional } from '@epfl-enac/arema';
import { useRoute, useRouter } from 'vue-router';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
const { api } = useFeathers();
const route = useRoute();
const router = useRouter();

const entityId = computed(() => (route.params.id as string).split('-').pop());
const entity = ref<Professional>();
const slide = ref(1);

const description = computed(() => {
  if (!entity.value) return '';
  return DOMPurify.sanitize(
    marked.parse(entity.value.description, { headerIds: false, mangle: false })
  );
});

onMounted(() => {
  api
    .service('professional')
    // .find({
    //   query: {
    //     $limit: 1,
    //     name: {
    //       $ilike: `%${route.params.id}%`,
    //     },
    //   },
    // })
    // .then((res) => {
    //   if (res.data.length === 0) router.push('/error');
    //   entity.value = res.data.pop() as Professional;
    // });
    .get(entityId.value)
    .then((res) => {
      entity.value = res as Professional;
    });
});
</script>
