#!/usr/bin/env node
import websocket from 'websocket';
import httpServer from './http-server';
import store from './store';
import {
  REGISTER_OWNER,
  ACTION_TYPE,
  ACTION_PAYLOAD,
  CLOSE_OWNER,
} from './constants.mjs';

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

  const id = parseInt(request.resourceURL.query.id, 10);

  store.dispatch({
    type: REGISTER_OWNER,
    payload: id, // deberia venir desde login (user, pass) => id player
  });

  const connection = request.accept(null, request.origin);
  console.log((new Date()) + ' Connection accepted.');

  const user = {
    id,
    sendText: message => connection.sendUTF(JSON.stringify(message)),
    sendData: buffer => connection.sendBytes(Buffer.from(buffer)),
  };

  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      const action = JSON.parse(message.utf8Data);

      if (action[ACTION_TYPE]) {
        store.dispatch({
          type: action[ACTION_TYPE],
          payload: action[ACTION_PAYLOAD],
          id,
        });
      }
    }
  });

  connection.on('close', (reasonCode, description) => {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    store.dispatch({
      type: CLOSE_OWNER,
      payload: id,
    });
    connectedUsers.delete(id);
  });

  connectedUsers.add(user);
});

export default connectedUsers;
