import { defineStore } from 'pinia';
import { api } from 'src/boot/api';
import type { Option } from 'src/components/models';
import type { Taxonomy, TaxonomyNode } from 'src/models';

const URN_PREFIX = 'urn:arema';

export const useTaxonomyStore = defineStore('taxonomies', () => {
  const { locale } = useI18n({ useScope: 'global' });

  const taxonomies = ref<Taxonomy>();
  const loading = ref(false);

  /**
   * Initializes the taxonomy store by fetching taxonomies from the API if not already loaded.
   * @returns {Promise<void>}
   */
  async function init() {
    if (taxonomies.value) {
      return Promise.resolve();
    }
    loading.value = true;
    return api
      .get('/taxonomy/')
      .then((resp) => {
        taxonomies.value = resp.data;
      })
      .finally(() => {
        loading.value = false;
      });
  }

  /**
   * Checks if the given string is a valid namespace URN.
   * @param {string} urn - The string to check.
   * @returns {boolean} True if the string is a valid namespace URN, false otherwise.
   */
  function isNamespace(urn: string): boolean {
    return urn.split(':').length === 3 && urn.startsWith(`${URN_PREFIX}:`);
  }

  /**
   * Converts an entity type and path to a URN string.
   * @param {string} entityType - The entity type to include in the URN.
   * @param {string | string[] | undefined} path - The path to include in the URN, either as a string or an array of strings.
   * @returns {string} The resulting URN string.
   */
  function toUrn(entityType: string, path: string | string[] | undefined) {
    const namespace = `${URN_PREFIX}:${entityType}`;
    if (!path || (Array.isArray(path) && path.length === 0)) {
      return namespace;
    }
    return `${namespace}:${Array.isArray(path) ? path.join('.') : path}`;
  }

  /**
   * Retrieves a taxonomy node based on the provided entity type or URN.
   * @param {string} entityTypeOrUrn - The entity type or URN to search for.
   * @returns {TaxonomyNode | undefined} The found taxonomy node, or undefined if not found.
   */
  function getTaxonomy(entityTypeOrUrn: string): TaxonomyNode | undefined {
    if (!taxonomies.value) return undefined;

    const tokens = entityTypeOrUrn.replace(`${URN_PREFIX}:`, '').split(':');
    if (!tokens || tokens.length === 0) return undefined;

    const entityType = tokens[0];
    return taxonomies.value?.taxonomy.find((tx) => tx.id === entityType);
  }

  /**
   * Retrieves a taxonomy node based on the provided entity type and path.
   * @param {string} entityType - The entity type to search for.
   * @param {string | string[] | undefined} path - The path to the desired node, either as a string or an array of strings.
   * @returns {TaxonomyNode | undefined} The found taxonomy node, or undefined if not found.
   */
  function getTaxonomyNode(
    entityType: string,
    path: string | string[] = [],
  ): TaxonomyNode | undefined {
    const tx = getTaxonomy(entityType);
    if (!tx) return undefined;
    return getNodeFromPath(tx, path);
  }

  /**
   * Retrieves a taxonomy node based on the provided URN.
   * @param {string} urn - The URN to search for.
   * @returns {TaxonomyNode | undefined} The found taxonomy node, or undefined if not found.
   */
  function getNode(urn: string): TaxonomyNode | undefined {
    const tokens = urn.replace(`${URN_PREFIX}:`, '').split(':');
    if (!tokens || tokens.length === 0) return undefined;

    const entityType = tokens[0];
    const root = taxonomies.value?.taxonomy.find((tx) => tx.id === entityType);
    if (!root || tokens.length === 1) return root;
    return getNodeFromPath(root, tokens[1]);
  }

  /**
   * Recursively retrieves a taxonomy node based on the provided path.
   * @param {TaxonomyNode} node - The current taxonomy node to search within.
   * @param {string | string[]} path - The path to the desired node, either as a string or an array of strings.
   * @returns {TaxonomyNode | undefined} The found taxonomy node, or undefined if not found.
   */
  function getNodeFromPath(
    node: TaxonomyNode,
    path: string | string[] = [],
  ): TaxonomyNode | undefined {
    const elements = Array.isArray(path) ? path : path.split('.');
    if (!elements || elements.length === 0) return node;
    if (!node.children || node.children.length === 0) return node;
    const child = node.children.find((n) => n.id === elements[0]);
    if (child && elements.length > 1) {
      return getNodeFromPath(child, elements.slice(1).join('.'));
    }
    return child;
  }

  /**
   * Retrieves the label for a taxonomy node based on the current locale, with a fallback to English.
   * @param {Record<string, string> | undefined} labels - A record of locale codes to labels.
   * @returns {string | undefined} The label for the current locale, or the English label if the current locale is not available, or undefined if no labels are provided.
   */
  function getLabel(labels: Record<string, string> | undefined): string | undefined {
    if (labels === undefined) return undefined;
    if (labels[locale.value]) return labels[locale.value];
    return labels['en'];
  }

  /**
   * Converts a taxonomy node and its children into an array of options suitable for use in a dropdown or select component.
   * @param {string} entityType - The entity type to include in the URN values of the options.
   * @param {TaxonomyNode | undefined} node - The taxonomy node to convert into options, including its children.
   * @param {string | string[] | undefined} path - The path to the current node, used for constructing URN values, either as a string or an array of strings.
   * @param {number} level - The current depth level in the taxonomy tree, used for recursive calls (default is 0).
   * @returns {Option[]} An array of options representing the taxonomy node and its children, with URN values and localized labels.
   */
  function asOptions(
    entityType: string,
    node: TaxonomyNode | undefined,
    path: string | string[] = [],
    level: number = 0,
  ): Option[] {
    if (!node?.children?.length) return [];

    const options = [];
    const prefix = Array.isArray(path) ? path : path.split('.');

    if (node && node.children) {
      for (const child of node.children) {
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
    }

    return options;
  }

  return {
    taxonomies,
    loading,
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
