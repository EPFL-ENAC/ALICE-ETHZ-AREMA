import { createClient } from '@epfl-enac/arema'; // exported by your feathers-api
import { createPiniaClient } from 'feathers-pinia';
import socketio from '@feathersjs/socketio-client';
// import rest from '@feathersjs/rest-client';
import io from 'socket.io-client';

import { pinia } from './modules/pinia';

// const host = process.env.API_URL;
// console.log('THIS IS THE host', host);
// if (!host) {
//   throw new Error('process.env.API is not defined')
// }
console.log("was here io: / and path /api/socket.io/");
const socket = io("/", {
  transports: ['websocket'],
  path: '/api/socket.io/',
  rejectUnauthorized: false
});
// process.env.API == 'http://localhost:3030'
// const restClient = rest(process.env.API_URL);

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
