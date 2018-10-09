import React from 'react';
import Player from '../Player';
import {
  ACTION_TYPE,
  ACTION_PAYLOAD,
  UPDATE_PLAYERS,
  MOVE_PLAYER,
  UP,
  DOWN,
  LEFT,
  RIGHT
} from '../constants.js';
import './Game.css';

const createAction = (type, payload) => ({
  [ACTION_TYPE]: type,
  [ACTION_PAYLOAD]: payload,
});

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.gameRef = new React.createRef();
    this.socket = null;

    this.state = {
      user: {
        id: null,
      },
      players: [],
    };
  }

  // registerUser(id) {
  //   this.setState({
  //     user: {
  //       id,
  //     }
  //   });
  // }

  // exitPlayer() {
  //   this.socket.send(JSON.stringify({
  //     type: 'C',
  //     payload: this.state.user.id,
  //   }));

  //   this.socket.close();
  // }

  connectToServer() {
    this.socket = new WebSocket(`ws://localhost:8080?id=${this.state.user.id}`);
    this.socket.binaryType = 'arraybuffer';

    this.socket.addEventListener('open', (event) => { });

    this.socket.addEventListener('message', (event) => {
      const buffer = event.data;
      const type = new Uint8Array(buffer, 0, 1);

      switch (type[0]) {
        case UPDATE_PLAYERS:
          const numItems = (buffer.byteLength - 2) / 8;
          const players = [];
          
          for (let index = 0; index < numItems; index += 1) {
            const offset = (index * 8) + 2;

            const id = new Uint8Array(buffer, offset, 2);
            const position = new Uint8Array(buffer, offset + 2, 2);
            const hp = new Uint16Array(buffer, offset + 4, 2);


            players.push({
              id: id[0],
              x: position[0],
              y: position[1],
              maxhp: hp[0],
              hp: hp[1],
            });
          }

          this.setState({
            players,
          });
          break;

        default:
          break;
      }
    });
  }

  componentDidMount() {
    // window.addEventListener("beforeunload", () => this.exitPlayer());

    const gameDom = this.gameRef.current;

    gameDom.addEventListener('keydown', (event) => {
      let action;

      switch (event.keyCode) {
        case 37:
          action = createAction(MOVE_PLAYER, LEFT);
          break;
        case 38:
          action = createAction(MOVE_PLAYER, UP);
          break;
        case 39:
          action = createAction(MOVE_PLAYER, RIGHT);
          break;
        case 40:
          action = createAction(MOVE_PLAYER, DOWN);
          break;

        default:
          break;
      }

      if (action) {
        this.socket.send(JSON.stringify(action));
      }
    });
  }

  render() {
    return (
      <section className="game" tabIndex="0" ref={this.gameRef}>
        {this.state.players.map(player => (
          <Player
            key={player.id}
            myself={player.id === this.state.user.id}
            hp={player.hp}
            maxhp={player.maxhp}
            x={player.x}
            y={player.y}
          />
        ))}

        <input onChange={event => this.setState({
          user: {
            id: parseInt(event.target.value, 10),
          }
        })} />
        <button onClick={() => this.connectToServer()}>
          Login
        </button>
      </section>
    );
  }
}

export default Game;

