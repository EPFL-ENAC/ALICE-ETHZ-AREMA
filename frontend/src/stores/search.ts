import { defineStore } from 'pinia';

export const useSearchService = defineStore('search', () => {
  const selectedTerms = ref<string[]>([]);
  const searching = ref(false);

  function reset() {
    selectedTerms.value = [];
  }

  function search() {
    searching.value = true;
    setTimeout(() => {
      searching.value = false;
    }, 1000);
    // TODO implement search
  }

  return {
    selectedTerms,
    searching,
    reset,
    search,
  };
});
