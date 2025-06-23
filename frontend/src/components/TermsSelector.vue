<template>
  <div v-if="!taxonomyStore.loading">
    <div>
      <q-btn
        v-for="taxoNode in nodes"
        :key="taxoNode.value"
        :outline="taxoNode.value !== selectedNode?.value"
        :disable="searchService.searching"
        v-show="!isNodeHidden(taxoNode)"
        color="primary"
        unelevated
        square
        no-caps
        size="md"
        :label="taxoNode.label"
        :title="$t('click_twice_to_select')"
        class="on-left q-mb-sm"
        @click="onTaxoNodeSelect(taxoNode)"
      >
        <q-badge
          v-if="getSelectedTaxoNodes(taxoNode).length"
          :color="taxoNode.value !== selectedNode?.value ? 'primary' : 'white'"
          :class="taxoNode.value !== selectedNode?.value ? 'text-white' : 'text-primary'"
          class="q-ml-xs"
        >
          {{ getSelectedTaxoNodes(taxoNode).length }}
        </q-badge>
      </q-btn>
    </div>
    <div class="q-mt-md" v-show="!isNodeHidden(selectedNode)">
      <template v-for="node in selectedNode?.children" :key="node.value">
        <q-btn-dropdown
          v-if="node.children?.length"
          :outline="!isNodeSelected(node)"
          :disable="searchService.searching"
          color="primary"
          unelevated
          square
          no-caps
          split
          size="12px"
          class="on-left q-mb-sm"
          @click="onNodeSelect(node)"
        >
          <template v-slot:label>
            {{ node.label }}
            <q-badge v-if="getSelectedNodes(node).length" color="white" class="text-primary q-ml-xs">
              {{ getSelectedNodes(node).length }}
            </q-badge>
          </template>
          <q-list>
            <template v-for="childOpt in node.children" :key="childOpt.urn">
              <q-item
                clickable
                class="text-primary"
                :active="isNodeSelected(childOpt)"
                active-class="text-white bg-primary"
                @click="onNodeSelect(childOpt)"
              >
                <q-item-section>
                  <q-item-label>{{ childOpt.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-btn-dropdown>
        <q-btn
          v-else
          :outline="!isNodeSelected(node)"
          :disable="searchService.searching"
          color="primary"
          unelevated
          square
          no-caps
          size="12px"
          :label="node.label"
          class="on-left q-mb-sm"
          @click="onNodeSelect(node)"
        />
      </template>
    </div>
    <q-separator size="2px" class="bg-primary q-mt-sm q-mb-md" />
    <div>
      <div class="q-gutter-sm text-secondary">
        <template v-for="tagOption in resourceTagOptions" :key="tagOption.urn">
          <q-checkbox
            v-model="searchService.selectedResourceTerms"
            :disable="searchService.searching"
            :val="tagOption.urn"
            color="secondary"
            :label="tagOption.label"
            class="q-mt-none"
            @update:model-value="onResourceTag"
          />
        </template>
      </div>
    </div>
    <q-separator size="2px" class="bg-primary q-mt-sm q-mb-md" />
  </div>
</template>

<script setup lang="ts">
import { TermOption, TaxonomyNodeOption } from 'src/components/models';

const taxonomyStore = useTaxonomyStore();
const searchService = useSearchService();

interface Props {
  view: string;
}

const props = defineProps<Props>();

const emit = defineEmits(['update:terms']);

const selectedNode = ref<TaxonomyNodeOption>();

const nodes = computed<TaxonomyNodeOption[]>(() => {
  return (
    taxonomyStore.taxonomies?.taxonomy.map((tx) => {
      const children = taxonomyStore.asOptions(tx.id, tx) as TaxonomyNodeOption[];
      return {
        value: taxonomyStore.toUrn(tx.id, []),
        label: taxonomyStore.getLabel(tx.names),
        children: children.length > 1 ? children : children[0].children,
      } as TaxonomyNodeOption;
    }) || []
  );
});

const resourceTagOptions = computed<TermOption[]>(() => {
  if (!taxonomyStore.taxonomies) return [];
  const resources = taxonomyStore.getTaxonomy('natural-resource');
  if (!resources) return [];
  const resourceVoc = resources.children?.find((voc) => voc.id === 'type');
  if (!resourceVoc) return [];
  return (
    resourceVoc.children?.map((term) => {
      const termOpt: TermOption = {
        value: term.id,
        label: taxonomyStore.getLabel(term.names) || term.id,
        urn: taxonomyStore.toUrn(resources.id, [resourceVoc.id, term.id]),
      };
      if (term.children?.length) {
        termOpt.children = term.children.map((child) => ({
          value: child.id,
          label: taxonomyStore.getLabel(child.names) || child.id,
          urn: taxonomyStore.toUrn(resources.id, [resourceVoc.id, term.id, child.id]),
        }));
      }
      return termOpt;
    }) || []
  );
});

function onTaxoNodeSelect(node: TaxonomyNodeOption) {
  if (!node.children || node.children.length === 0) {
    // if no children, just select the node
    selectedNode.value = node;
    searchService.selectNode(node);
    emit('update:terms');
    return;
  }
  const selectedChildren = searchService.getSelectedNodes(node);
  const allChildren = searchService.getAllChildren(node);
  if (selectedNode.value?.value === node.value) {
    // if the node is already selected
    if (selectedChildren.length === allChildren.length) {
      // if all children are selected, clear selection
      searchService.unselectNodeChildren(node);
    } else if (selectedChildren.length < allChildren.length) {
      // if no children are selected, select all
      searchService.selectNode(node);
    } else {
      // if some children are selected, do nothing
      return;
    }
  } else {
    // if the node is not selected
    selectedNode.value = node;
    if (selectedChildren.length === 0) {
      // if no children are selected, select all
      searchService.selectNodeChildren(node);
    } else {
      // if some children are selected, do nothing
      return;
    }
  }
  emit('update:terms');
}

function onNodeSelect(node: TaxonomyNodeOption) {
  if (!selectedNode.value) return;
  searchService.selectNode(node);
  emit('update:terms');
}

function getSelectedNodes(node: TaxonomyNodeOption) {
  return searchService.getSelectedNodes(node);
}

function getSelectedTaxoNodes(node: TaxonomyNodeOption) {
  if (!node) return [];
  // if the node has children, we need to get selected nodes from all children
  return (
    node.children?.reduce((acc: string[], child) => {
      acc.push(...searchService.getSelectedNodes(child));
      return acc;
    }, []) || []
  );
}

function isNodeSelected(node: TaxonomyNodeOption) {
  return searchService.isNodeSelected(node);
}

function isNodeHidden(node: TaxonomyNodeOption | undefined) {
  if (!node) return true;
  return props.view === 'map' && node.value !== 'urn:arema:building' && node.value !== 'urn:arema:professional';
}

function onResourceTag() {
  emit('update:terms');
}
</script>
