#!/usr/bin/env node
import connectedUsers from './ws-server';
import { ACTION_TYPES } from './constants';
import store from './store';

const createAction = (type, payload) => ({
  type,
  payload,
});

// game loop
setInterval(() => {
  if (connectedUsers.size > 0) {
    connectedUsers.forEach(user => {
      const state = store.getState();
      user.send();
    });
  }
}, 1000);