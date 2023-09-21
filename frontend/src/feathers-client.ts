import { createClient } from '@epfl-enac/arema'; // exported by your feathers-api
import { createPiniaClient } from 'feathers-pinia';
import socketio from '@feathersjs/socketio-client';
// import rest from '@feathersjs/rest-client';
import io from 'socket.io-client';

import { pinia } from './modules/pinia';

const host = process.env.API_URL ?? '';
const apiPath = process.env.API_PATH ?? '';

const socket = io(host, {//'https://localhost/', {
  transports: ['websocket'],
  path: `${apiPath}/socket.io/`,//path: '/api/socket.io/',
  rejectUnauthorized: false
});
// const restClient = rest(`${process.env.API_URL}${process.env.API_PATH}`);
export const feathersClient = createClient(
  socketio(socket),
  // restClient.fetch(window.fetch.bind(window)),
  { storage: window.localStorage }
);
export const api = createPiniaClient(feathersClient, {
  pinia,
  storage: window.localStorage,
  idField: 'id',
  whitelist: ['$regex'],
  paramsForServer: []
});
