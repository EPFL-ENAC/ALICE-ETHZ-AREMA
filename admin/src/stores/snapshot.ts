import { defineStore } from 'pinia';
import { api } from 'src/boot/api';

const authStore = useAuthStore();

export const useSnapshotService = defineStore('snapshot', () => {
  async function downloadSnapshot() {
    await authStore.updateToken();
    const config = {
      responseType: 'blob' as const,
      headers: {
        Authorization: `Bearer ${authStore.getAccessToken()}`,
      },
    };
    const res = await api.post('/snapshot/', {}, config);
    // file download is handled by the browser, so we just return the blob
    // Ensure it's a Blob regardless of what axios returns
    const blob =
      res.data instanceof Blob ? res.data : new Blob([res.data], { type: 'application/zip' });
    return blob;
  }

  return {
    downloadSnapshot,
  };
});
