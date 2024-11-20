import { defineStore } from 'pinia';
import { api } from 'src/boot/api';
import { Taxonomy, TaxonomyLabel } from 'src/models';

export const useTaxonomyStore = defineStore('taxonomies', () => {
  const { locale } = useI18n({ useScope: 'global' });

  async function getTaxonomy(entityType: string): Promise<Taxonomy> {
    return api.get(`/taxonomy/${entityType}`).then((resp) => resp.data);
  }

  function getLabel(labels: TaxonomyLabel[] | undefined): string | undefined {
    if (labels === undefined) return undefined;
    const label = labels.find((lbl) => lbl.locale === locale.value)?.label;
    if (label === undefined) {
      return labels.find((lbl) => lbl.locale === 'en')?.label;
    }
    return label;
  }

  return {
    getTaxonomy,
    getLabel,
  };
});
