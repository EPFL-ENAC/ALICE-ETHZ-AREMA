import { defineStore } from 'pinia';
import { api } from 'src/boot/api';
import type { IGLehmProjectSummary, IGLehmProject } from 'src/models';

const authStore = useAuthStore();

export const useImporterService = defineStore('importer', () => {
  async function fetchIGLehmProjects(): Promise<IGLehmProjectSummary[]> {
    const res = await api.get('/importer/iglehm/projects', {
      headers: await getAuthHeaders(),
    });
    return res.data;
  }

  async function fetchIGLehmProject(projectId: number): Promise<IGLehmProject> {
    const res = await api.get(`/importer/iglehm/project/${projectId}`, {
      headers: await getAuthHeaders(),
    });
    return res.data;
  }

  async function getAuthHeaders() {
    await authStore.updateToken();
    return {
      Authorization: `Bearer ${authStore.getAccessToken()}`,
    };
  }

  return {
    fetchIGLehmProjects,
    fetchIGLehmProject,
  };
});
