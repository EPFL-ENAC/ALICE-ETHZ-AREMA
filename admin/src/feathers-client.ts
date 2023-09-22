import { createClient } from '@epfl-enac/arema';
import { createPiniaClient } from 'feathers-pinia';
import { pinia } from './modules/pinia';
import rest from '@feathersjs/rest-client';

const restClient = rest(`${process.env.API_URL}${process.env.API_PATH}`);

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
