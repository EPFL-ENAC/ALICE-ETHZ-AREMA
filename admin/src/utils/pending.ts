import { reactive } from 'vue';

/**
 * Ids of entities with a state or assignee change request in progress, shared by the row buttons.
 */
export const pendingIds = reactive(new Set<number | string>());
