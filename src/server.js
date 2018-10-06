#!/usr/bin/env node
const WebSocketServer = require('websocket').server;
const http = require('http');
const uniqid = require('uniqid');

const server = http.createServer(function (request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(8080, function () {
  console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  return true;
}

const REGISTER_OWNER = 'R';
const ADD_PLAYER = 'A';
const MOVE_PLAYER = 'M';
const DELETE_PLAYER = 'D';
const UPDATE_STATE = 'U';

const parseMessage = msg => JSON.parse(msg);
const createMessage = action => JSON.stringify(action);

const createAction = (type, payload) => ({
  type,
  payload,
  timestamp: Date.now(),
});

const state = new Map();

state.set('players', new Map());
state.set('actions', new Set());

const tellEveryone = (message) => {
  state.get('players').forEach(player => {
    player.connection.sendUTF(message);
  });
};

setInterval(() => {
  state.get('actions').forEach(action => {
    switch (action.type) {
      case ADD_PLAYER:
        state.get('players').set(action.payload.id, {
          connection: action.payload.connection,
          owner: action.payload.owner,
        });
        break;
      case MOVE_PLAYER:
        break;
      case DELETE_PLAYER:
        if (state.get('players').get(action.payload.id).owner === action.payload.owner) {
          state.get('players').delete(action.payload.id);
        }
        break;
    
      default:
        break;
    }
  });

  // voi aqui, se informa del nuevo estado a todos los clientes ************************************
  tellEveryone(createMessage(createAction(UPDATE_STATE, state)));

  state.get('actions').clear();
}, 100);

// const coordenadaAleatoria = () => (Math.random() * 80) + 2;

// const tellEveryone = (type, payload) => {
//   state.players.forEach(player => {
//     player.connection.sendUTF(JSON.stringify({ type, payload }));
//   });
// };

// const addNewPlayer = (id, connection) => {
//   state.players.set(id, {
//     connection,
//   });

//   tellEveryone('N', id);
// };

// const movePlayer = (id, x, y) => {
//   state.players.set(id, {
//     ...state.players.get(id),
//     position: {
//       x,
//       y,
//     }
//   });

//   tellEveryone('M', { id, x, y });
// };

// const removePlayer = (id) => {
//   state.players.delete(id);
//   tellEveryone('D', id);
// };

// const registerNewUser = (connection) => {
//   const id = uniqid();
//   const playerList = [];

//   state.players.forEach((player, pid) => {
//     playerList.push({
//       pid,
//       position: player.position,
//     });
//   })

//   connection.sendUTF(JSON.stringify({
//     type: 'R',
//     payload: {
//       id,
//       players: playerList,
//     }
//   }));

//   addNewPlayer(id, connection);
//   movePlayer(id, coordenadaAleatoria(), coordenadaAleatoria());
// };

wsServer.on('request', function (request) {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }

  const connection = request.accept(null, request.origin);
  console.log((new Date()) + ' Connection accepted.');

  // registerNewUser(connection);
  const owner = uniqid();
  state.get('actions').add(createAction(ADD_PLAYER, {
    id: uniqid(),
    owner,
    connection,
  }));

  const registerResponse = createMessage(createAction(REGISTER_OWNER, owner));
  connection.sendUTF(registerResponse);

  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data);
      //connection.sendUTF(message.utf8Data);
      
      const data = parseMessage(message.utf8Data);
      const action = createAction(data.type, data.payload);
      state.get('actions').add(action);

      // switch (data.type) {
      //   case 'C':
      //     removePlayer(data.payload);    
      //     break;
      
      //   default:
      //     break;
      // }
    }
  });

  connection.on('close', (reasonCode, description) => {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});
