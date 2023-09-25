import { Knex } from 'knex'
import { app } from '../src/app'
import { logger } from '../src/logger'
import { user } from '../src/services/users/users';

export async function seed(knex: Knex): Promise<void> {
  // in case there is no administrator user and seeding env variables are provided
  // seed an administrator user
  if (app.get('administratorEmail') && app.get('administratorPassword')) {

    const users = await app.service('users').find({
      query: {
        email: app.get('administratorEmail'),
      }
    });
    const userInfo = {
      email: app.get('administratorEmail'),
      password: app.get('administratorPassword'),
      role: 'admin'
    };
    if (users.total === 0) {
      // no admin user found - seed one
      logger.info('Seeding admin user')
      try {
        const resp = await app.service('users').create(userInfo);

        logger.info('user admin created: %s', JSON.stringify(resp));
      } catch (error) {
        // ignore
        logger.error(error);
      }
    } else {
      // admin user found - update password
      logger.info('Updating admin user')
      const userId = users.data[0].id;
      try {
        const resp = await app.service('users').patch(userId, userInfo);
        logger.info('user admin updated: %s', JSON.stringify(resp));
      } catch (error) {
        // ignore
        logger.error(error);
      }
    }
    return;
  }
  logger.debug('Seeding admin user not done: no username or password provided');
}
