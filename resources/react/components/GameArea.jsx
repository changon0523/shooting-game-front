import React from 'react';
import { AREA_WIDTH, AREA_HEIGHT } from '../constants/gameConstants';
import Enemy from './Enemy';
import Player from './Player';
import MissileList from './Missile';

const GameArea = ({ player, missiles, onMissileShoot, onPlayerMove }) => {
  return (
    <div
      className="launch-area mx-auto relative bg-gray-900 border-2 border-white"
      style={{ 
        width: `${AREA_WIDTH}px`, 
        height: `${AREA_HEIGHT}px`,
        marginTop: '20px',
        marginBottom: '20px'
      }}
    >
      <Enemy />
      <Player
        position={player}
        onMissileShoot={onMissileShoot}
        onPositionChange={onPlayerMove}
      />
      <MissileList missiles={missiles} />
    </div>
  );
};

export default GameArea;
