import redux from 'redux';
import {
  ONLINE,
  OFFLINE,
  MOVE_PLAYER,
  REGISTER_OWNER,
  CLOSE_OWNER,
  LEFT,
  RIGHT,
  DOWN,
  UP,
} from './constants.mjs';

const createStore = redux.createStore;

const initialState = {
  players: new Map([
    [1, {
      id: 1,
      status: OFFLINE,
      maxhp: 200,
      maxmp: 500,
      hp: 100,
      mp: 350,
      x: 21,
      y: 45,
    }],
    [2, {
      id: 2,
      status: OFFLINE,
      maxhp: 300,
      maxmp: 100,
      hp: 250,
      mp: 100,
      x: 50,
      y: 2,
    }]
  ]),
  maps: new Map([
    [1, {
      name: 'Bosque Oscuro',
      players: new Set([1, 2]),
    }]
  ]),
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_OWNER: {
      const players = new Map(state.players);
      players.set(action.payload, {
        ...players.get(action.payload),
        status: ONLINE,
      });

      return {
        ...state,
        players,
      };
    }

    case CLOSE_OWNER: {
      const players = new Map(state.players);
      players.set(action.payload, {
        ...players.get(action.payload),
        status: OFFLINE,
      });

      return {
        ...state,
        players,
      };
    }

    case MOVE_PLAYER: {
      const players = new Map(state.players);

      const diffX = action.payload === LEFT ? -1 : (action.payload === RIGHT ? 1 : 0);
      const diffY = action.payload === DOWN ? 1 : (action.payload === UP ? -1 : 0);

      const player = players.get(action.id);

      players.set(action.id, {
        ...player,
        x: player.x + diffX,
        y: player.y + diffY,
      });

      return {
        ...state,
        players,
      };
    }

    default:
      break;
  }
};

const store = createStore(reducer);

export default store;