import React from 'react';
import Player from '../Player';
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

  registerUser(id) {
    this.setState({
      user: {
        id,
      }
    });
  }

  removePlayer(id) {
    this.setState({
      players: this.state.players.filter(player => player.id === id),
    });
  }

  addNewPlayer(id, x, y) {
    this.setState({
      players: [
        ...this.state.players,
        {
          id,
          myself: id === this.state.user.id,
          position: {
            x,
            y,
          }
        },
      ],
    });
  }

  movePlayer(id, x, y) {
    this.setState({
      players: this.state.players.map(player => {
        if (player.id === id) {
          return {
            ...player,
            position: {
              x,
              y,
            },
          };
        }

        return player;
      }),
    });
  }

  exitPlayer() {
    this.socket.send(JSON.stringify({
      type: 'C',
      payload: this.state.user.id,
    }));

    this.socket.close();
  }

  componentDidMount() {
    this.socket = new WebSocket('ws://192.168.0.19:8080');

    this.socket.addEventListener('open', (event) => {

    });

    this.socket.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);

      switch (msg.type) {
        case 'R':
          this.registerUser(msg.payload.id);
          msg.payload.players.map(player =>
            this.addNewPlayer(player.id, player.position.x, player.position.y));
          break;

        case 'N':
          this.addNewPlayer(msg.payload);
          break;

        case 'M':
          this.movePlayer(msg.payload.id, msg.payload.x, msg.payload.y);
          break;

        case 'D':
          this.removePlayer(msg.payload);
          break;

        default:
          break;
      }
    });

    window.addEventListener("beforeunload", () => this.exitPlayer());

    const gameDom = this.gameRef.current;

    gameDom.addEventListener('onkeydown', (event) => {
      if (event.keycode === 38) {
        // haz algo :V
      }
    });
  }

  render() {
    return (
      <section className="game" ref={this.gameRef}>
        {this.state.players.map(player => (
          <Player
            key={player.id}
            name={player.name}
            myself={player.myself}
            position={player.position}
          />
        ))}

        ID: {this.state.user.id}
      </section>
    );
  }
}

export default Game;

