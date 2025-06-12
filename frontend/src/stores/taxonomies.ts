import { defineStore } from 'pinia';
import { api } from 'src/boot/api';
import { Option } from 'src/components/models';
import { Taxonomy, TaxonomyNode } from 'src/models';

const URN_PREFIX = 'urn:arema';

export const useTaxonomyStore = defineStore('taxonomies', () => {
  const { locale } = useI18n({ useScope: 'global' });

  const taxonomies = ref<Taxonomy>();

  async function init() {
    if (taxonomies.value) {
      return Promise.resolve();
    }
    return api.get('/taxonomy/').then((resp) => {
      taxonomies.value = resp.data;
    });
  }

  function isNamespace(urn: string): boolean {
    return urn.split(':').length === 3 && urn.startsWith(`${URN_PREFIX}:`);
  }

  function toUrn(entityType: string, path: string | string[] | undefined) {
    const namespace = `${URN_PREFIX}:${entityType}`;
    if (!path || (Array.isArray(path) && path.length === 0)) {
      return namespace;
    }
    return `${namespace}:${Array.isArray(path) ? path.join('.') : path}`;
  }

  function getTaxonomy(entityTypeOrUrn: string): TaxonomyNode | undefined {
    if (!taxonomies.value) return undefined;

    const tokens = entityTypeOrUrn.replace(`${URN_PREFIX}:`, '').split(':');
    if (!tokens || tokens.length === 0) return undefined;

    const entityType = tokens[0];
    return taxonomies.value?.taxonomy.find((tx) => tx.id === entityType);
  }

  function getTaxonomyNode(entityType: string, path: string | string[] = []): TaxonomyNode | undefined {
    const tx = getTaxonomy(entityType);
    if (!tx) return undefined;
    return getNodeFromPath(tx, path);
  }

  function getNode(urn: string): TaxonomyNode | undefined {
    const tokens = urn.replace(`${URN_PREFIX}:`, '').split(':');
    if (!tokens || tokens.length === 0) return undefined;

    const entityType = tokens[0];
    const root = taxonomies.value?.taxonomy.find((tx) => tx.id === entityType);
    if (!root || tokens.length === 1) return root;
    return getNodeFromPath(root, tokens[1]);
  }

  function getNodeFromPath(node: TaxonomyNode, path: string | string[] = []): TaxonomyNode | undefined {
    const elements = Array.isArray(path) ? path : path.split('.');
    if (!elements || elements.length === 0) return node;
    if (!node.children || node.children.length === 0) return node;
    const child = node.children.find((n) => n.id === elements[0]);
    if (child && elements.length > 1) {
      return getNodeFromPath(child, elements.slice(1).join('.'));
    }
    return child;
  }

  function getLabel(labels: Record<string, string> | undefined): string | undefined {
    if (labels === undefined) return undefined;
    if (labels[locale.value]) return labels[locale.value];
    return labels['en'];
  }

  function asOptions(
    entityType: string,
    node: TaxonomyNode | undefined,
    path: string | string[] = [],
    level: number = 0,
  ): Option[] {
    if (!node?.children?.length) return [];

    const options = [];
    const prefix = Array.isArray(path) ? path : path.split('.');

    for (const child of node?.children) {
      const opt = {
        value: toUrn(entityType, [...prefix, child.id]),
        label: getLabel(child.names) || child.id,
      } as Option;
      options.push(opt);
      if (child.children?.length) {
        const opts = asOptions(entityType, child, [...prefix, child.id], level + 1);
        opt.children = opts;
      }
    }

    return options;
  }

  return {
    taxonomies,
    init,
    getTaxonomy,
    getTaxonomyNode,
    getNode,
    getLabel,
    isNamespace,
    toUrn,
    asOptions,
  };
});
