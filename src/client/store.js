import { createStore } from 'redux';
import { UPDATE_PLAYERS, CONNECT_USER, ONLINE, OFFLINE } from './constants';
import { parseBinaryPlayers } from './binary';

const initialState = {
  players: [],
  monsters: [],
  chat: [],
  user: {
    status: OFFLINE,
    id: null,
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PLAYERS: {
      const players = parseBinaryPlayers(action.payload);
      return {
        ...state,
        players,
      };
    }

    case CONNECT_USER: {
      return {
        ...state,
        user: {
          ...state.user,
          status: ONLINE,
        },
      };
    }

    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
