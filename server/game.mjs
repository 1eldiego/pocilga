#!/usr/bin/env node
import connectedUsers from './ws-server';
import store from './store';
import {
  UPDATE_PLAYERS,
  ONLINE,
  TICK_RATE,
} from './constants.mjs';

const lastData = new Map();

const updateDataToBin = (data = []) => {
  const bytesRequired = (data.size * 8) + 2;
  const buffer = new ArrayBuffer(bytesRequired);
  const head = new Uint8Array(buffer, 0, 1);

  head[0] = UPDATE_PLAYERS;

  let index = 0;

  data.forEach((entity) => {
    const offset = (index * 8) + 2;

    const id = new Uint8Array(buffer, offset, 2);
    const position = new Uint8Array(buffer, offset + 2, 2);
    const hp = new Uint16Array(buffer, offset + 4, 2);

    id[0] = entity.id;
    position[0] = entity.x;
    position[1] = entity.y;
    hp[0] = entity.maxhp;
    hp[1] = entity.hp;

    index += 1;
  });

  return buffer;
};

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
      const buffer = updateDataToBin(playersData);
      const stringBuffer = String(new Uint8Array(buffer));

      const myLastData = lastData.get(user.id);

      if (!myLastData ||
        (myLastData && myLastData !== stringBuffer)
      ) {
        user.sendData(buffer);
      }

      lastData.set(user.id, stringBuffer);
    });
  }
}, TICK_RATE);