import { defineStore } from 'pinia';
import { api } from '@/boot/api';
import type { SnapshotTask } from '@/models';

const authStore = useAuthStore();

export const useSnapshotService = defineStore('snapshot', () => {
  const downloading = ref(false);
  const snapshotTask = ref<SnapshotTask | null>(null);

  async function launchSnapshot() {
    if (snapshotTask.value && snapshotTask.value.status === 'pending') {
      // snapshot is already running, do not launch a new one
      return;
    }
    downloading.value = true;
    await authStore.updateToken();
    const config = {
      headers: {
        Authorization: `Bearer ${authStore.getAccessToken()}`,
      },
    };
    try {
      const res: { data: SnapshotTask } = await api.post('/snapshot/', {}, config);
      snapshotTask.value = res.data;
      if (!snapshotTask.value) {
        throw new Error('Failed to launch snapshot');
      }
      // Polling for the snapshot task status until it's done or error
      const pollInterval = 2000; // 2 seconds
      while (snapshotTask.value.status === 'pending') {
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
        const res: { data: SnapshotTask } = await api.get(
          `/snapshot/${snapshotTask.value.task_id}`,
          config,
        );
        snapshotTask.value = res.data;
        if (!snapshotTask.value) {
          throw new Error('Failed to fetch snapshot task status');
        }
      }
    } catch (error) {
      console.error('Error launching snapshot:', error);
      snapshotTask.value = {
        task_id: '',
        status: 'error',
        error: 'Failed to launch snapshot',
      };
    } finally {
      downloading.value = false;
    }
  }

  async function downloadSnapshot() {
    if (!snapshotTask.value || snapshotTask.value.status !== 'done') {
      throw new Error('Snapshot is not ready for download');
    }
    downloading.value = true;
    await authStore.updateToken();
    const config = {
      responseType: 'blob' as const,
      headers: {
        Authorization: `Bearer ${authStore.getAccessToken()}`,
      },
    };
    try {
      const res: { data: Blob } = await api.get(
        `/snapshot/${snapshotTask.value.task_id}/download`,
        config,
      );
      // file download is handled by the browser, so we just return the blob
      // Ensure it's a Blob regardless of what axios returns
      const blob =
        res.data instanceof Blob ? res.data : new Blob([res.data], { type: 'application/zip' });
      return blob;
    } finally {
      downloading.value = false;
    }
  }

  return {
    downloading,
    snapshotTask,
    launchSnapshot,
    downloadSnapshot,
  };
});
