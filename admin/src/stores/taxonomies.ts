import { defineStore } from 'pinia';
import { api } from 'src/boot/api';
import { Taxonomy, TaxonomyLabel, TaxonomyNode } from 'src/models';

const URN_PREFIX = 'urn:arema';

export const useTaxonomyStore = defineStore('taxonomies', () => {
  const { locale } = useI18n({ useScope: 'global' });

  async function getTaxonomy(entityType: string): Promise<Taxonomy> {
    return api.get(`/taxonomy/${entityType}`).then((resp) => resp.data);
  }

  function toUrn(entityType: string, path: string | string[]) {
    return `${URN_PREFIX}:${entityType}:${Array.isArray(path) ? path.join('.') : path}`;
  }

  function getNode(taxonomy: Taxonomy, urn: string): TaxonomyNode | undefined {
    const tokens = urn.replace(`${URN_PREFIX}:`, '').split(':');
    if (!tokens || tokens.length === 0) return undefined;

    const entityType = tokens[0];
    const root = taxonomy.taxonomy.find((tx) => tx.id === entityType);
    if (!root || tokens.length === 1) return root;
    return getNodeFromPath(root, tokens[1]);
  }

  function getNodeFromPath(
    node: TaxonomyNode,
    path: string,
  ): TaxonomyNode | undefined {
    const elements = path.split('.');
    if (!elements || elements.length === 0) return node;
    if (!node.children || node.children.length === 0) return node;
    const child = node.children.find((n) => n.id === elements[0]);
    if (child && elements.length > 1) {
      return getNodeFromPath(child, elements.slice(1).join('.'));
    }
    return child;
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
    getNode,
    getLabel,
    toUrn,
  };
});
