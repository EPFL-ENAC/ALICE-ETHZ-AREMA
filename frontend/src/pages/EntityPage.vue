<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row">
      <div class="col-12 col-md-3"></div>
      <div class="col-12 col-md-6">
        <div v-if="entity">
          <div class="text-primary text-uppercase">{{ $t(entity_type) }}</div>
          <div class="text-h3">{{ entity.name }}</div>

          <div class="text-body1">{{ entity.description }}</div>
          <div v-if="getImageUrls(entity).length">
            <template v-for="url in getImageUrls(entity)" :key="url">
              <q-img :src="url" style="max-height: 100px; max-width: 100px" />
            </template>
          </div>
          <pre>{{ entity }}</pre>
        </div>
      </div>
      <div class="col-12 col-md-3"></div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { cdnUrl } from 'src/boot/api';
import {
  NaturalResource,
  TechnicalConstruction,
  BuildingMaterial,
  Building,
  Professional,
  BuildingElement,
} from 'src/models';

const route = useRoute();
const services = useServices();
const entity = ref<
  | NaturalResource
  | TechnicalConstruction
  | BuildingMaterial
  | Building
  | Professional
  | BuildingElement
>();

const entity_type = computed(() => route.name);

let service = null;

onMounted(updateEntity);

watch(() => route.params.id, updateEntity);

async function updateEntity() {
  console.log('EntityPage: updateEntity');
  if (route.name && route.params.id) {
    service = services.make(route.name as string);
    entity.value = await service.get(route.params.id as string);
  }
}

function getImageUrls() {
  if (!entity.value) return [];
  const images = entity.value.files
    ? entity.value.files
        .filter((fileRef) => fileRef.ref.mime_type?.startsWith('image'))
        .map((fileRef) => `${cdnUrl}/${fileRef.ref.path}`)
    : [];
  console.log('getImageUrls', images);
  return images;
}
</script>
