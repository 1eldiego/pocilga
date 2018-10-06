import React from 'react';
import './Player.css';

const Player = (props) => (props.position ? (
  <div
    className="player"
    style={{ left: `${props.position.x}vw`, top: `${props.position.y}vh` }}
  >
    <div className="player__body">
      <div className="player__eye" />
      <div className="player__eye" />
    </div>

    {props.myself &&
      <div className="player__indicator" />
    }
  </div>
) : null);

export default Player;

