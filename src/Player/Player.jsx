import React from 'react';
import './Player.css';

const Player = (props) => (
  <div
    className="player"
    style={{ left: `${props.x}vw`, top: `${props.y}vh` }}
  >
    <div className="player__body">
      <div className="player__eye" />
      <div className="player__eye" />
    </div>

    {props.myself &&
      <div className="player__indicator" />
    }

    {props.hp} / {props.maxhp}
  </div>
);

export default Player;

