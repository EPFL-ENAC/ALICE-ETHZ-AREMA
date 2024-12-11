import { defineStore } from 'pinia';
import { api } from 'src/boot/api';
import { SearchResult } from 'src/models';

export const useSearchService = defineStore('search', () => {
  const selectedTerms = ref<string[]>([]);
  const searching = ref(false);
  const results = ref<SearchResult>();

  function reset() {
    selectedTerms.value = [];
  }

  function search() {
    searching.value = true;
    results.value = undefined;
    return api
      .get('/search', {
        params: {
          tags: selectedTerms.value,
        },
        paramsSerializer: {
          indexes: null, // no brackets at all
        },
      })
      .then((response) => {
        results.value = response.data;
      })
      .finally(() => {
        searching.value = false;
      });
  }

  return {
    selectedTerms,
    searching,
    results,
    reset,
    search,
  };
});
