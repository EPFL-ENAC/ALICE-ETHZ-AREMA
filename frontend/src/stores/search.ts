import { defineStore } from 'pinia';
import { api } from 'src/boot/api';
import { SearchResult, Document, VideoResult } from 'src/models';
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from 'geojson';

export const useSearchService = defineStore('search', () => {
  const selectedView = ref('map');
  const selectedTerms = ref<string[]>([]);
  const filterText = ref('');
  const searching = ref(false);
  const results = ref<SearchResult>();
  const geoResults = ref<SearchResult>();
  const videoResults = ref<VideoResult>();
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

  async function getDocument(
    id: string,
    fields: string[] = [],
    index: string = 'entities',
  ): Promise<Document> {
    searching.value = true;
    return api
      .get('/search/_doc', {
        params: { id, fields, index },
        paramsSerializer: {
          indexes: null, // no brackets at all
        },
      })
      .then((response) => {
        const result = response.data;
        return result.data?.length ? result.data[0] : undefined;
      })
      .finally(() => (searching.value = false));
  }

  async function search_entities(withLimit: number = limit.value) {
    searching.value = true;
    results.value = undefined;
    geoResults.value = undefined;
    limit.value = withLimit;
    return Promise.all([
      api
        .get('/search/_entities', {
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
        .get('/search/_entities', {
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

  async function search_videos(withLimit: number = limit.value) {
    searching.value = true;
    videoResults.value = undefined;
    limit.value = withLimit;
    return api
      .get('/search/_videos', {
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
        videoResults.value = response.data;
      })
      .finally(() => {
        searching.value = false;
      });
  }

  return {
    selectedView,
    selectedTerms,
    filterText,
    searching,
    results,
    geoResults,
    videoResults,
    features,
    hasFilters,
    skip,
    limit,
    reset,
    search_entities,
    search_videos,
    getDocument,
  };
});
