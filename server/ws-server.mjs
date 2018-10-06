#!/usr/bin/env node
import websocket from 'websocket';
import uniqid from 'uniqid';
import httpServer from './http-server';
import store from './store';
import { REGISTER_OWNER } from './constants.mjs';

const wsServer = new websocket.server({
  httpServer,
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  return true;
}

const connectedUsers = new Set();

wsServer.on('request', function (request) {
  if (!originIsAllowed(request.origin) || !request.resourceURL.query.id) {
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }

  const id = uniqid();

  store.dispatch({
    type: REGISTER_OWNER,
    payload: request.resourceURL.query.id, // deberia venir desde login (user, pass) => id player
  });

  const connection = request.accept(null, request.origin);
  console.log((new Date()) + ' Connection accepted.');

  const user = {
    id,
    send: message => connection.sendUTF(JSON.stringify(message)),
  };

  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data);

      const action = JSON.parse(message.utf8Data);

      if (action.type) {
        store.dispatch({
          ...action,
          id,
        });
      }
    }
  });

  connection.on('close', (reasonCode, description) => {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    connectedUsers.delete(id);
  });

  connectedUsers.add(user);
});

export default connectedUsers;
