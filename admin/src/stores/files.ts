import { defineStore } from 'pinia';
import type { FileObject } from 'src/components/models';
import type { FileRef } from 'src/models';
import { api } from 'src/boot/api';

const authStore = useAuthStore();

export const useFilesStore = defineStore('files', () => {
  const filesToDelete = ref<FileRef[]>([]);

  async function uploadTmpFile(file: FileObject): Promise<FileRef> {
    await authStore.updateToken();
    const formData = new FormData();
    formData.append('files', file);
    const res = await api.post('/files/tmp', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authStore.getAccessToken()}`,
      },
    });
    if (res.data && res.data.length) return res.data[0];
    throw new Error('No file returned from server');
  }

  function addFileToDelete(file: FileRef) {
    filesToDelete.value.push(file);
  }

  function clearFilesToDelete() {
    filesToDelete.value = [];
  }

  async function deleteFile(file: FileRef) {
    await authStore.updateToken();
    if (!file.path) return Promise.resolve();
    const config = {
      headers: {
        Authorization: `Bearer ${authStore.getAccessToken()}`,
      },
    };
    const promises = [];
    if (file.alt_path) {
      promises.push(api.delete(`/files/${file.alt_path}`, config));
    }
    promises.push(api.delete(`/files/${file.path}`, config));
    return await Promise.all(promises);
  }

  async function deleteFiles() {
    if (filesToDelete.value.length === 0) return Promise.resolve();
    if (!authStore.isAuthenticated) throw new Error('Not authenticated');
    return authStore.updateToken().then(() => {
      const promises = [];
      // delete files
      for (const file of filesToDelete.value) {
        promises.push(deleteFile(file));
      }
      filesToDelete.value = [];
      return Promise.all(promises);
    });
  }

  return {
    filesToDelete,
    uploadTmpFile,
    addFileToDelete,
    clearFilesToDelete,
    deleteFiles,
  };
});
