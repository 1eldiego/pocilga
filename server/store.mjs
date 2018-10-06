import { createStore } from 'redux';
import { ONLINE, OFFLINE, MOVE_PLAYER } from './constants.mjs';

const initialState = {
  players: {
    1: {
      status: OFFLINE,
      maxhp: 200,
      maxmp: 500,
      hp: 100,
      mp: 350,
      x: 21,
      y: 45,
    },
    2: {
      status: ONLINE,
      maxhp: 300,
      maxmp: 100,
      hp: 250,
      mp: 100,
      x: 50,
      y: 2,
    }
  },
  maps: {
    1: {
      name: 'Bosque Oscuro',
      players: new Set([1, 2]),
    }
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_OWNER:
      return {
        ...state,
        players: {
          ...state.players,
          [action.payload]: {
            ...state.players[action.payload],
            status: ONLINE,
          }
        },
      };

    case MOVE_PLAYER:
      const player = state.sessions.get(action.payload.id);

      return {
        ...state,
        players: {
          ...players,
          [player]: {
            ...players[player],
            x: 2,
            y: 1,
          },
        },
      };

    default:
      break;
  }
};

const store = createStore(reducer);

export default store;