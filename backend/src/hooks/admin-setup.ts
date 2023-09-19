// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext, NextFunction } from '../declarations'
import { logger } from '../logger'

export const adminSetup = async (context: HookContext, next: NextFunction) => {
  console.log(`Running hook admin-setup on ${context.path}.${context.method}`)
  // in case there is no administrator user and seeding env variables are provided
  // seed an administrator user
  if (context.app.get('administratorEmail') && context.app.get('administratorPassword')) {
    const users = await context.app.service('users').find({
      query: {
        $limit: 0,
        role: 'administrator'
      }
    });
    if (users.total === 0) {
      const userInfo = {
        email: context.app.get('administratorEmail'),
        password: context.app.get('administratorPassword'),
        role: 'admin'
      };
      logger.debug('Seeding with: %s', userInfo);
      try {
        await context.app.service('users').create(userInfo);
      } catch (error) {
        // ignore
        logger.error(error);
      }
    }
  }
  await next()
}
