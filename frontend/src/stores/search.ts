import { defineStore } from 'pinia';
import { api } from 'src/boot/api';
import { SearchResult, Document, VideoResult } from 'src/models';
import { VocabularyOption, TermOption } from 'src/components/models';
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

export const useSearchService = defineStore('search', () => {
  const selectedView = ref('map');
  const selectedTerms = ref<string[]>([]);
  const filterText = ref('');
  const bbox = ref<number[][]>([]);
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

  async function getDocument(id: string, fields: string[] = []): Promise<Document> {
    searching.value = true;
    return api
      .get('/search/_doc', {
        params: { id, fields, index: 'entities' },
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

  async function getRelatedDocuments(id: string, fields: string[] = []): Promise<SearchResult> {
    searching.value = true;
    return api
      .get('/search/_entities', {
        params: { id, fields, relates: [id] },
        paramsSerializer: {
          indexes: null, // no brackets at all
        },
      })
      .then((response) => {
        const result = response.data;
        return result;
      })
      .finally(() => (searching.value = false));
  }

  async function search_entities(withLimit: number = limit.value) {
    searching.value = true;
    results.value = undefined;
    geoResults.value = undefined;
    limit.value = withLimit;
    const bboxCriteria = bbox.value && bbox.value.length == 2 ? [...bbox.value[0], ...bbox.value[1]] : undefined;
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
            bbox: bboxCriteria,
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

  // selection utils

  function selectTerm(term: TermOption) {
    if (term.children) {
      // any selected child terms ?
      if (term.children.some((child) => selectedTerms.value.includes(child.urn))) {
        // clear all child terms
        selectedTerms.value = selectedTerms.value.filter((urn) => !term.children?.find((child) => child.urn === urn));
      } else {
        // select all child terms
        selectedTerms.value.push(...term.children.map((child) => child.urn));
      }
    } else {
      // toggle term selection
      const urn = term.urn;
      selectedTerms.value.includes(urn)
        ? selectedTerms.value.splice(selectedTerms.value.indexOf(urn), 1)
        : selectedTerms.value.push(urn);
    }
  }

  function getSelectedTerms(node: VocabularyOption | TermOption) {
    return selectedTerms.value.filter((term) => term.startsWith(node.urn)) || [];
  }

  function isTermSelected(term: TermOption) {
    if (term.children) {
      return term.children.some((child) => selectedTerms.value.includes(child.urn));
    }
    return selectedTerms.value.includes(term.urn);
  }

  return {
    selectedView,
    selectedTerms,
    filterText,
    bbox,
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
    getRelatedDocuments,
    selectTerm,
    getSelectedTerms,
    isTermSelected,
  };
});
