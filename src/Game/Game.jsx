import React from 'react';
import Player from '../Player';
import {
  ACTION_TYPE,
  ACTION_PAYLOAD,
  UPDATE_STATE,
  ID,
  POSITION_X,
  POSITION_Y,
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
    this.socket = new WebSocket(`ws://192.168.0.19:8080?id=${this.state.user.id}`);

    this.socket.addEventListener('open', (event) => { });

    this.socket.addEventListener('message', (event) => {
      const action = JSON.parse(event.data);
      const type = action[ACTION_TYPE];
      const payload = action[ACTION_PAYLOAD];

      switch (type) {
        case UPDATE_STATE:
          this.setState({
            players: payload,
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
            key={player[ID]}
            myself={player[ID] === this.state.user.id}
            x={player[POSITION_X]}
            y={player[POSITION_Y]}
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

