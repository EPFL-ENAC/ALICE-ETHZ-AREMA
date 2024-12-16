import { defineStore } from 'pinia';
import { api } from 'src/boot/api';
import { SearchResult, Document } from 'src/models';
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from 'geojson';

export const useSearchService = defineStore('search', () => {
  const selectedTerms = ref<string[]>([]);
  const filterText = ref('');
  const searching = ref(false);
  const results = ref<SearchResult>();
  const geoResults = ref<SearchResult>();
  const skip = ref(0);
  const limit = ref(100);

  const features = computed<FeatureCollection>(() => {
    const collection: Array<Feature<Geometry, GeoJsonProperties>> = [];
    if (geoResults.value && geoResults.value.data?.length) {
      geoResults.value.data.forEach((doc: Document) => {
        const properties = { ...doc };
        delete properties.location;
        const feature = {
          type: 'Feature',
          properties,
          geometry: {
            type: 'Point',
            coordinates: [doc.location?.lon, doc.location?.lat],
          },
        } as Feature;
        collection.push(feature);
      });
    }
    return {
      type: 'FeatureCollection',
      features: collection,
    };
  });

  const hasFilters = computed(() => {
    return selectedTerms.value.length > 0 || filterText.value?.length > 0;
  });

  function reset() {
    selectedTerms.value = [];
  }

  function search(withLimit: number = limit.value) {
    searching.value = true;
    results.value = undefined;
    limit.value = withLimit;
    return Promise.all([
      api
        .get('/search/', {
          params: {
            tags: selectedTerms.value,
            text: filterText.value,
            skip: skip.value,
            limit: limit.value,
          },
          paramsSerializer: {
            indexes: null, // no brackets at all
          },
        })
        .then((response) => {
          results.value = response.data;
        }),
      api
        .get('/search/', {
          params: {
            tags: selectedTerms.value,
            text: filterText.value,
            skip: skip.value,
            limit: limit.value,
            exists: ['location'],
          },
          paramsSerializer: {
            indexes: null, // no brackets at all
          },
        })
        .then((response) => {
          geoResults.value = response.data;
        }),
    ]).finally(() => {
      searching.value = false;
    });
  }

  return {
    selectedTerms,
    filterText,
    searching,
    results,
    geoResults,
    features,
    hasFilters,
    skip,
    limit,
    reset,
    search,
  };
});
