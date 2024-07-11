// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

/**
 * Timestamps and authors are not to be provided by external sources.
 * This hook removes them from the data object.
 * @param context 
 */
export const timestampsStripping = async (context: HookContext) => {
  if (context.params.provider !== undefined && context.data) {
    delete context.data.createdAt;
    delete context.data.createdById;
    delete context.data.updatedAt;
    delete context.data.updatedById;
  }
}
