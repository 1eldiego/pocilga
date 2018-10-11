import React from 'react';
import Player from '../Player';
import { connect } from '../networking';
import { keyDown } from '../input';
import './Game.css';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.gameRef = new React.createRef();

    this.state = {
      id: null,
    };
  }

  componentDidMount() {
    const gameDom = this.gameRef.current;

    gameDom.addEventListener('keydown', keyDown);
  }

  render() {
    return (
      <section className="game" tabIndex="0" ref={this.gameRef}>
        {this.props.players.map(player => (
          <Player
            key={player.id}
            myself={player.id === this.state.id}
            hp={player.hp}
            maxhp={player.maxhp}
            x={player.x}
            y={player.y}
          />
        ))}

        <input onChange={event => this.setState({
          id: parseInt(event.target.value, 10),
        })} />
        <button onClick={() => connect(this.state.id)}>
          Login
        </button>
      </section>
    );
  }
}

export default Game;
