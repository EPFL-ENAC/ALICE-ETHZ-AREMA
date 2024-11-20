import { defineStore } from 'pinia';
import { api } from 'src/boot/api';
import { Taxonomy } from 'src/models';

export const useTaxonomyStore = defineStore('taxonomies', () => {
  async function getTaxonomy(entityType: string): Promise<Taxonomy> {
    return api.get(`/taxonomy/${entityType}`).then((resp) => resp.data);
  }

  return {
    getTaxonomy,
  };
});
