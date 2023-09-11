import { HookContext, NextFunction } from '@feathersjs/feathers'

export const allowAnonymous = async (context: HookContext, next: NextFunction) => {
  try {
    const { params } = context
    if (params.provider && !params.authentication) {
      context.params = {
        ...params,
        authentication: {
          strategy: 'anonymous'
        }
      }
    }
    await next()
  } catch (error: any) {
    throw error
  }
}
