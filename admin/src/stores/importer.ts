import { defineStore } from 'pinia';
import { api } from 'src/boot/api';
import type { IGLehmProjectSummary, IGLehmProject } from 'src/models';

export const useImporterService = defineStore('importer', () => {
  async function fetchIGLehmProjects(): Promise<IGLehmProjectSummary[]> {
    const res = await api.get('/importer/iglehm/projects');
    return res.data;
  }

  async function fetchIGLehmProject(projectId: number): Promise<IGLehmProject> {
    const res = await api.get(`/importer/iglehm/project/${projectId}`);
    return res.data;
  }

  return {
    fetchIGLehmProjects,
    fetchIGLehmProject,
  };
});
