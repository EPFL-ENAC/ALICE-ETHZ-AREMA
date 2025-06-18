import { defineStore } from 'pinia';
import { FileObject } from 'src/components/models';
import { FileRef } from 'src/models';
import { api } from 'src/boot/api';

const authStore = useAuthStore();

export const useFilesStore = defineStore('files', () => {
  const filesToDelete = ref<FileRef[]>([]);

  async function uploadTmpFile(file: FileObject): Promise<FileRef> {
    return authStore.updateToken().then(() => {
      const formData = new FormData();
      formData.append('files', file);
      return api
        .post('/files/tmp', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authStore.accessToken}`,
          },
        })
        .then((res) => (res.data && res.data.length ? res.data[0] : null));
    });
  }

  function addFileToDelete(file: FileRef) {
    filesToDelete.value.push(file);
  }

  function clearFilesToDelete() {
    filesToDelete.value = [];
  }

  async function deleteFile(file: FileRef) {
    return authStore.updateToken().then(() => {
      if (!file.path) return Promise.resolve();
      const config = {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      };
      const promises = [];
      if (file.alt_path) {
        promises.push(api.delete(`/files/${file.alt_path}`, config));
      }
      promises.push(api.delete(`/files/${file.path}`, config));
      return Promise.all(promises);
    });
  }

  async function deleteFiles() {
    if (filesToDelete.value.length === 0) return Promise.resolve();
    if (!authStore.isAuthenticated) return Promise.reject('Not authenticated');
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
