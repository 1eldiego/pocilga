import store from './store';
import { getBinaryAction } from './binary';
import { CONNECT_USER } from './constants';

let socket;

const onOpen = (event) => {
  store.dispatch({
    type: CONNECT_USER,
  });
};

const onMessage = (event) => {
  const action = getBinaryAction(event.data);
  store.dispatch(action);
};

export const connect = (id) => {
  socket = new WebSocket(`ws://localhost:8080?id=${id}`);
  socket.binaryType = 'arraybuffer';

  socket.addEventListener('open', onOpen);
  socket.addEventListener('message', onMessage);
};

export const sendMessage = (message) => {
  socket.send(message);
};