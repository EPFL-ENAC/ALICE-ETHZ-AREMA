<template>
  <q-page>
    <div class="row q-pa-lg q-mt-md">
      <div class="col"></div>
      <div class="col-md-6 col-sm-8 col-xs-12">
        <div class="text-h4 text-weight-thin q-mb-lg">
          {{ $t('building.title') }} ::: {{ entity?.name }}
        </div>
        <div>
          <q-chip
            v-for="tag in entity?.tags"
            :key="tag"
            :label="$t(tag)"
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
        <div class="q-mt-md">
          <q-carousel animated v-model="slide" arrows infinite thumbnails>
            <q-carousel-slide :name="0" img-src="/faker/slope9.jpg" />
            <q-carousel-slide
              :name="1"
              img-src="/faker/27_2b-architectes_Maison-BB-ph-Mathieu-Gafsou_full.jpg"
            />
          </q-carousel>
        </div>
        <div class="text-h6 q-mt-md">More...</div>
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
const slide = ref(0);

const description = computed(() => {
  if (!entity.value) return '';
  return DOMPurify.sanitize(
    marked.parse(entity.value.description, { headerIds: false, mangle: false })
  );
});

onMounted(() => {
  api
    .service('professional')
    .get(entityId.value as string)
    .then((res) => {
      entity.value = res as Professional;
    })
    .catch(() => {
      router.push('/error');
    });
});
</script>
