import { defineStore } from 'pinia';
import { api } from 'src/boot/api';

const authStore = useAuthStore();

export const useSearchService = defineStore('search', () => {
  const indexing = ref(false);

  function dropIndex() {
    indexing.value = true;
    return authStore.updateToken().then(() => {
      const config = {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      };
      return api
        .delete('/search/_index', config)
        .finally(() => (indexing.value = false));
    });
  }

  function indexAll() {
    indexing.value = true;
    return authStore.updateToken().then(() => {
      const config = {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      };
      return api
        .post('/search/_index', {}, config)
        .then((res) => res.data)
        .finally(() => (indexing.value = false));
    });
  }

  return {
    indexing,
    dropIndex,
    indexAll,
  };
});
