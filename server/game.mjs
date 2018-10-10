#!/usr/bin/env node
import connectedUsers from './ws-server';
import store from './store';
import {
  UPDATE_PLAYERS,
  ONLINE,
  TICK_RATE,
} from './constants.mjs';


const updateDataToBin = (data = []) => {
  const bytesRequired = (data.size * 7) + 1;
  const buffer = new ArrayBuffer(bytesRequired);
  const view = new DataView(buffer);
  
  view.setUint8(0, UPDATE_PLAYERS);
  
  let index = 0;
  
  data.forEach((entity) => {
    const offset = (index * 7) + 1;
    
    view.setUint8(offset, entity.id);
    view.setUint8(offset + 1, entity.x);
    view.setUint8(offset + 2, entity.y);
    view.setUint16(offset + 3, entity.maxhp);
    view.setUint16(offset + 5, entity.hp);
    
    index += 1;
  });
  
  return buffer;
};

const lastData = new Map();

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