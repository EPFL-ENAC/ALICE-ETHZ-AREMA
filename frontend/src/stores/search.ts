import { defineStore } from 'pinia';
import { api } from 'src/boot/api';
import { SearchResult } from 'src/models';

export const useSearchService = defineStore('search', () => {
  const selectedTerms = ref<string[]>([]);
  const filterText = ref('');
  const searching = ref(false);
  const results = ref<SearchResult>();
  const skip = ref(0);
  const limit = ref(100);

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
    return api
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
      })
      .finally(() => {
        searching.value = false;
      });
  }

  return {
    selectedTerms,
    filterText,
    searching,
    results,
    hasFilters,
    skip,
    limit,
    reset,
    search,
  };
});
