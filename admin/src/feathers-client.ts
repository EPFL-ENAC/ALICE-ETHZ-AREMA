import { createClient } from 'backend';
import { createPiniaClient } from 'feathers-pinia';
import { pinia } from './modules/pinia';
import rest from '@feathersjs/rest-client';

const restClient = rest(process.env.API);

export const feathersClient = createClient(
  restClient.fetch(window.fetch.bind(window)),
  { storage: window.localStorage }
);

export const api = createPiniaClient(feathersClient, {
  pinia,
  storage: window.localStorage,
  idField: '_id',
  whitelist: ['$regex'],
  paramsForServer: [],
});
