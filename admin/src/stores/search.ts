import { defineStore } from 'pinia';
import { api } from 'src/boot/api';

const authStore = useAuthStore();

export const useSearchService = defineStore('search', () => {
  const indexing = ref(false);

  async function dropIndex() {
    indexing.value = true;
    await authStore.updateToken();
    const config = {
      headers: {
        Authorization: `Bearer ${authStore.getAccessToken()}`,
      },
    };
    try {
      return await api.delete('/search/_index', config);
    } finally {
      indexing.value = false;
    }
  }

  async function indexAll() {
    indexing.value = true;
    await authStore.updateToken();
    const config = {
      headers: {
        Authorization: `Bearer ${authStore.getAccessToken()}`,
      },
    };
    try {
      const res = await api.post('/search/_index', {}, config);
      return res.data;
    } finally {
      indexing.value = false;
    }
  }

  return {
    indexing,
    dropIndex,
    indexAll,
  };
});
