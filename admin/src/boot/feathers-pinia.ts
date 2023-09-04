// boot feathers-pinia
import { api } from '../feathers-client';
import { pinia } from '../modules/pinia';

// @ts-expect-error initial test
export default ({ app }) => {
  app.use(pinia);
  app.use(api);
};
