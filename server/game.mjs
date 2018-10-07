#!/usr/bin/env node
import connectedUsers from './ws-server';
import store from './store';
import {
  UPDATE_STATE,
  ACTION_TYPE,
  ACTION_PAYLOAD,
  ONLINE,
  ID,
  MAX_VIDA,
  CURRENT_VIDA,
  POSITION_X,
  POSITION_Y,
  TICK_RATE,
} from './constants.mjs';

const createAction = (type, payload) => ({
  type,
  payload,
});

// game loop
setInterval(() => {
  if (connectedUsers.size > 0) {
    const state = store.getState();

    const playersInMaps = new Map();
    const mapPlayers = new Map();

    state.maps.forEach((map, mapId) => {
      const players = new Set();

      map.players.forEach((playerId) => {
        mapPlayers.set(playerId, mapId);
        const playerData = state.players.get(playerId);

        if (playerData.status === ONLINE) {
          players.add(state.players.get(playerId));
        }
      });

      playersInMaps.set(mapId, players);
    });

    connectedUsers.forEach((user) => {
      const userMap = mapPlayers.get(user.id);
      const playersData = playersInMaps.get(userMap);
      const parsedData = [];

      playersData.forEach((data) => {
        parsedData.push({
          [ID]: data.id,
          [MAX_VIDA]: data.maxhp,
          [CURRENT_VIDA]: data.hp,
          // [MAX_PALTA]: data.maxmp,
          // [CURRENT_PALTA]: data.mp, // deberian ir como data personal
          [POSITION_X]: data.x,
          [POSITION_Y]: data.y,
        });
      });

      user.send({ [ACTION_TYPE]: UPDATE_STATE, [ACTION_PAYLOAD]: parsedData });
    });
  }
}, TICK_RATE);