import React from 'react';
import Player from '../Player';
import {
  UPDATE_PLAYERS,
  MOVE_PLAYER,
  UP,
  DOWN,
  LEFT,
  RIGHT
} from '../constants.js';
import './Game.css';

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
      const view = new DataView(buffer);
      const type = view.getUint8(0);

      switch (type) {
        case UPDATE_PLAYERS:
          const numItems = (buffer.byteLength - 1) / 7;
          const players = [];

          for (let index = 0; index < numItems; index += 1) {
            const offset = (index * 7) + 1;

            players.push({
              id: view.getUint8(offset),
              x: view.getUint8(offset + 1),
              y: view.getUint8(offset + 2),
              maxhp: view.getUint16(offset + 3),
              hp: view.getUint16(offset + 5),
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
      let payload;
      let type;

      switch (event.keyCode) {
        case 37:
          type = MOVE_PLAYER;
          payload = LEFT;
          break;
        case 38:
          type = MOVE_PLAYER;
          payload = UP;
          break;
        case 39:
          type = MOVE_PLAYER;
          payload = RIGHT;
          break;
        case 40:
          type = MOVE_PLAYER;
          payload = DOWN;
          break;

        default:
          break;
      }

      if (type) {
        const buffer = new ArrayBuffer(2);
        const view = new DataView(buffer);
        view.setUint8(0, type);
        view.setUint8(1, payload);
        this.socket.send(buffer);
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

