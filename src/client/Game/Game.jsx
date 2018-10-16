import React from 'react';
import * as PIXI from 'pixi.js';
import './Game.css';

class Game extends React.PureComponent {
  constructor(props) {
    super(props);
    this.gameDom = new React.createRef();

    this.setup = this.setup.bind(this);
    this.gameLoop = this.gameLoop.bind(this);
    
    this.player = null;
    this.xPiece = 0;
    this.yPiece = 0;
  }

  componentDidMount() {
    this.xPiece = this.gameDom.current.clientWidth / 20;
    this.yPiece = this.gameDom.current.clientHeight / 10;

    this.app = new PIXI.Application({
      width: this.xPiece * 20,
      height: this.yPiece * 10,
      antialias: true,
    });

    this.gameDom.current.appendChild(this.app.view);

    PIXI.loader
      .add('assets/avatars.png')
      .load(this.setup);
  }

  gameLoop() {
    this.props.game.players.forEach(player => {
      if (player.id === this.props.game.user.id) {
        if (this.player.position.x !== player.x * this.xPiece) {
          this.player.position.x += this.xPiece / (60 / 0,3); // calcular diferencia positiva o negativa!
        }
      }
    });
  }

  setup() {
    const avatars = PIXI.loader.resources["assets/avatars.png"].texture;
    avatars.frame = new PIXI.Rectangle(156, 0, 34, 52);

    this.player = new PIXI.Sprite(avatars);

    this.player.position.set(
      (this.gameDom.current.clientWidth / 2) - 17,
      (this.gameDom.current.clientHeight / 2) - 26,
    );

    this.app.stage.addChild(this.player);
    this.app.ticker.add(delta => this.gameLoop(delta));
  }

  render() {
    return (
      <div className="game" ref={this.gameDom} />
    );
  }
}

export default Game;