import { defineStore } from 'pinia';
import { api } from 'src/boot/api';
import type { IGLehmProjectSummary, IGLehmProject, IGLehmSpecialistSummary } from 'src/models';

const authStore = useAuthStore();

export const useImporterService = defineStore('importer', () => {
  async function fetchIGLehmSpecialists(): Promise<IGLehmSpecialistSummary[]> {
    const res = await api.get('/importer/iglehm/specialists', {
      headers: await getAuthHeaders(),
    });
    return res.data;
  }

  async function fetchIGLehmSpecialist(specialistId: number): Promise<IGLehmSpecialistSummary> {
    const res = await api.get(`/importer/iglehm/specialist/${specialistId}`, {
      headers: await getAuthHeaders(),
    });
    return res.data;
  }

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
    fetchIGLehmSpecialists,
    fetchIGLehmSpecialist,
  };
});
