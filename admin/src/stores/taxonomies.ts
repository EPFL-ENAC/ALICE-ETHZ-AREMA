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

  function toUrn(entityType: string, path: string | string[]) {
    return `${URN_PREFIX}:${entityType}:${Array.isArray(path) ? path.join('.') : path}`;
  }

  async function getTaxonomy(entityType: string): Promise<TaxonomyNode | undefined> {
    if (!taxonomies.value) {
      return init().then(() => {
        if (!taxonomies.value) return undefined;
        else return getTaxonomy(entityType);
      });
    }
    return Promise.resolve(taxonomies.value?.taxonomy.find((tx) => tx.id === entityType));
  }

  async function getTaxonomyNode(entityType: string, path: string | string[] = []): Promise<TaxonomyNode | undefined> {
    const tx = await getTaxonomy(entityType);
    if (!tx) return Promise.resolve(undefined);
    return Promise.resolve(getNodeFromPath(tx, path));
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
        level: level,
        selectable: child.children ? child.children.length === 0 : true,
      };
      options.push(opt);
      if (child.children?.length) {
        const opts = asOptions(entityType, child, [...prefix, child.id], level + 1);
        options.push(...opts);
      }
    }

    return options;
  }

  return {
    getTaxonomy,
    getTaxonomyNode,
    getNode,
    getLabel,
    toUrn,
    asOptions,
  };
});
