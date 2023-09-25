// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

export const entityCreated = async (context: HookContext) => {
  if (context.data) {
    const { user } = context.params
    const now = new Date().toISOString()

    context.data = {
      ...context.data,
      createdAt: now,
      updatedAt: now,
      createdById: user?.id,
      updatedById: user?.id
    }
  }
}
