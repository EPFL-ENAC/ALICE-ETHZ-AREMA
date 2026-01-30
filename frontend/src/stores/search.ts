import { defineStore } from 'pinia';
import { api } from 'src/boot/api';
import type { SearchResult, Document, VideoResult } from 'src/models';
import type { TaxonomyNodeOption } from 'src/components/models';
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

export const useSearchService = defineStore('search', () => {
  const selectedView = ref('list'); // 'list' | 'map'
  const selectedTerms = ref<string[]>([]);
  const selectedResourceTerms = ref<string[]>([]);
  const filterText = ref('');
  const bbox = ref<[[number, number], [number, number]]>();
  const searching = ref(false);
  const results = ref<SearchResult>();
  const geoResults = ref<SearchResult>();
  const videoResults = ref<VideoResult>();
  const skip = ref(0);
  const limit = ref(100);
  // all features (when no bounding box filter)
  const features = ref<FeatureCollection>();

  const hasFilters = computed(() => {
    return selectedTerms.value.length > 0 || filterText.value?.length > 0;
  });

  function reset() {
    selectedTerms.value = [];
  }

  async function getDocument(id: string, fields: string[] = []): Promise<Document> {
    searching.value = true;
    try {
      const response = await api.get('/search/_doc', {
        params: { id, fields, index: 'entities' },
        paramsSerializer: {
          indexes: null, // no brackets at all
        },
      });
      const result = response.data;
      if (!result || !result.data || !result.data.length) {
        throw new Error(`Document with id ${id} not found`);
      }
      return result.data[0];
    } finally {
      searching.value = false;
    }
  }

  async function getAuthors(keys: string[] = []): Promise<SearchResult> {
    searching.value = true;
    try {
      const response = await api.get('/search/_authors', {
        params: { keys, index: 'entities' },
        paramsSerializer: {
          indexes: null, // no brackets at all
        },
      });
      const result = response.data;
      return result;
    } finally {
      searching.value = false;
    }
  }

  async function getRelatedDocuments(id: string, fields: string[] = []): Promise<SearchResult> {
    searching.value = true;
    try {
      const response = await api.get('/search/_entities', {
        params: { fields, relates: [id] },
        paramsSerializer: {
          indexes: null, // no brackets at all
        },
      });
      const result = response.data;
      return result;
    } finally {
      searching.value = false;
    }
  }

  async function getDocumentsFromTags(
    tags: string[],
    fields: string[] = [],
  ): Promise<SearchResult> {
    searching.value = true;
    try {
      const response = await api.get('/search/_entities', {
        params: { fields, tags },
        paramsSerializer: {
          indexes: null, // no brackets at all
        },
      });
      const result = response.data;
      return result;
    } finally {
      searching.value = false;
    }
  }

  async function search_entities(withLimit: number = limit.value) {
    searching.value = true;
    results.value = undefined;
    geoResults.value = undefined;
    limit.value = withLimit;
    const bboxCriteria =
      bbox.value && bbox.value.length == 2 ? [...bbox.value[0], ...bbox.value[1]] : undefined;
    return Promise.all([
      api
        .get('/search/_entities', {
          params: {
            resources: selectedResourceTerms.value,
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
            resources: selectedResourceTerms.value,
            tags: selectedTerms.value.filter((t) =>
              ['urn:arema:professional', 'urn:arema:building'].some((tx) => t.startsWith(`${tx}:`)),
            ), // remove location tags
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
          features.value = asFeatureCollection();
        }),
    ]).finally(() => {
      searching.value = false;
    });
  }

  function asFeatureCollection() {
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
    } as FeatureCollection;
  }

  async function search_videos(withLimit: number = limit.value) {
    searching.value = true;
    videoResults.value = undefined;
    limit.value = withLimit;
    try {
      const response = await api.get('/search/_videos', {
        params: {
          resources: selectedResourceTerms.value,
          tags: selectedTerms.value,
          text: filterText.value,
          skip: skip.value,
          limit: limit.value,
        },
        paramsSerializer: {
          indexes: null, // no brackets at all
        },
      });
      videoResults.value = response.data;
    } finally {
      searching.value = false;
    }
  }

  // selection utils

  function selectUrn(urn: string) {
    if (selectedTerms.value.includes(urn)) {
      selectedTerms.value.splice(selectedTerms.value.indexOf(urn), 1);
    } else {
      selectedTerms.value.push(urn);
    }
  }

  function selectNode(node: TaxonomyNodeOption) {
    if (node.children) {
      // get all leafs of the node
      const leafs = getAllChildren(node);

      // any selected child terms ?
      if (leafs.every((child) => selectedTerms.value.includes(child))) {
        // clear all child terms
        selectedTerms.value = selectedTerms.value.filter((urn) => !leafs.includes(urn));
      } else {
        // select all child terms
        selectedTerms.value = selectedTerms.value.filter((urn) => !leafs.includes(urn));
        selectedTerms.value.push(...leafs);
      }
    } else {
      // toggle term selection
      const urn = node.value;
      if (selectedTerms.value.includes(urn)) {
        selectedTerms.value.splice(selectedTerms.value.indexOf(urn), 1);
      } else {
        selectedTerms.value.push(urn);
      }
    }
  }

  function selectNodeChildren(node: TaxonomyNodeOption) {
    if (node.children) {
      // get all leafs of the node
      const leafs = getAllChildren(node);

      // select all child terms
      selectedTerms.value = selectedTerms.value.filter((urn) => !leafs.includes(urn));
      selectedTerms.value.push(...leafs);
    }
  }

  function unselectNodeChildren(node: TaxonomyNodeOption) {
    if (node.children) {
      // get all leafs of the node
      const leafs = getAllChildren(node);

      // select all child terms
      selectedTerms.value = selectedTerms.value.filter((urn) => !leafs.includes(urn));
    }
  }

  // get node leafs recursively
  function getAllChildren(n: TaxonomyNodeOption): string[] {
    if (!n.children || n.children.length === 0) {
      return [n.value];
    }
    return n.children.flatMap((child) => getAllChildren(child));
  }

  function getSelectedNodes(node: TaxonomyNodeOption): string[] {
    if (!node || !node.value) {
      return [];
    }
    // get all leafs of the node
    const leafs = getAllChildren(node);

    return selectedTerms.value.filter((term) => leafs.includes(term)) || [];
  }

  function isNodeSelected(node: TaxonomyNodeOption) {
    if (node.children) {
      return node.children.some((child) => selectedTerms.value.includes(child.value));
    }
    return selectedTerms.value.includes(node.value);
  }

  return {
    selectedView,
    selectedTerms,
    selectedResourceTerms,
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
    getAuthors,
    getRelatedDocuments,
    getDocumentsFromTags,
    getSelectedNodes,
    getAllChildren,
    isNodeSelected,
    selectNode,
    selectNodeChildren,
    unselectNodeChildren,
    selectUrn,
  };
});
