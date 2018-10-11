import { createStore } from 'redux';
import { UPDATE_PLAYERS } from './constants';
import { parseBinaryPlayers } from './binary';

const initialState = {
  players: [],
  monsters: [],
  chat: [],
  user: {
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

    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;