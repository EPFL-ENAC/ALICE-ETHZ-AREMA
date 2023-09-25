// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

export const userRegistration = async (context: HookContext) => {
  // case of self registration or missing role property
  if (context.params.provider && (!context.params.authentication || !context.data.role)) {
    context.data.role = 'guest'
  }
}
