import React, { useEffect } from 'react';
import {
  AREA_WIDTH,
  AREA_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_SPEED
} from '../constants/gameConstants';

const Player = ({ onMissileShoot, position, onPositionChange }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // プレイヤー移動 (矢印キー)
      onPositionChange((prevPlayer) => {
        let newX = prevPlayer.x;
        let newY = prevPlayer.y;

        // 押されたキーに応じて座標を更新
        if (e.key === 'ArrowLeft') {
          newX = Math.max(0, prevPlayer.x - PLAYER_SPEED);
        } else if (e.key === 'ArrowRight') {
          newX = Math.min(AREA_WIDTH - prevPlayer.width, prevPlayer.x + PLAYER_SPEED);
        } else if (e.key === 'ArrowUp') {
          newY = Math.max(0, prevPlayer.y - PLAYER_SPEED);
        } else if (e.key === 'ArrowDown') {
          newY = Math.min(AREA_HEIGHT - prevPlayer.height, prevPlayer.y + PLAYER_SPEED);
        }

        if (newX !== prevPlayer.x || newY !== prevPlayer.y) {
          return { ...prevPlayer, x: newX, y: newY };
        }
        return prevPlayer;
      });

      // ミサイル発射 (スペースキー)
      if (e.key === ' ') {
        e.preventDefault();
        onMissileShoot(position);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position, onMissileShoot, onPositionChange]);

  return (
    <div
      className="player absolute"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${position.width}px`,
        height: `${position.height}px`,
        backgroundColor: '#4299e1',
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        transition: 'transform 0.1s ease',
        boxShadow: '0 0 10px rgba(66, 153, 225, 0.5)'
      }}
    />
  );
};

export default Player;
