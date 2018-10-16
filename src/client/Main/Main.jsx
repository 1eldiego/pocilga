import React from 'react';
import Game from '../Game';
import { connect } from '../networking';
// import { keyDown } from '../input';
import './Main.css';
import { ONLINE, OFFLINE } from '../constants';

class Main extends React.Component {
  constructor(props) {
    super(props);

    // this.gameRef = new React.createRef();

    this.state = {
      id: null,
    };
  }

  componentDidMount() {
    // const gameDom = this.gameRef.current;

    // gameDom.addEventListener('keydown', keyDown);
  }

  render() {
    return (
      <section className="main" tabIndex="0" ref={this.gameRef}>
        {/* {this.props.players.map(player => (
          <Player
            key={player.id}
            myself={player.id === this.state.id}
            hp={player.hp}
            maxhp={player.maxhp}
            x={player.x}
            y={player.y}
          />
        ))} */}

        {this.props.user.status === ONLINE &&
          <Game />
        }

        {this.props.user.status === OFFLINE &&
          <>
            <input onChange={event => this.setState({
              id: parseInt(event.target.value, 10),
            })} />

            <button onClick={() => {
              connect(this.state.id);
            }}>
              Login
            </button>
          </>
        }
      </section>
    );
  }
}

export default Main;
