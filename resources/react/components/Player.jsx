import React, { useEffect, useRef } from 'react';
import {
  AREA_WIDTH,
  AREA_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_SPEED
} from '../constants/gameConstants';

const Player = ({ onMissileShoot, position, onPositionChange }) => {
  const keysPressed = useRef({}); // 押されているキーを追跡
  const animationFrameId = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;

      // ミサイル発射 (スペースキー)
      if (e.key === ' ') {
        e.preventDefault();
        onMissileShoot(position);
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };

    const updatePosition = () => {
      onPositionChange((prevPlayer) => {
        let newX = prevPlayer.x;
        let newY = prevPlayer.y;

        // 押されているキーに応じて座標を更新
        if (keysPressed.current['ArrowLeft']) {
          newX = Math.max(0, prevPlayer.x - PLAYER_SPEED);
        }
        if (keysPressed.current['ArrowRight']) {
          newX = Math.min(AREA_WIDTH - prevPlayer.width, prevPlayer.x + PLAYER_SPEED);
        }
        if (keysPressed.current['ArrowUp']) {
          newY = Math.max(0, prevPlayer.y - PLAYER_SPEED);
        }
        if (keysPressed.current['ArrowDown']) {
          newY = Math.min(AREA_HEIGHT - prevPlayer.height, prevPlayer.y + PLAYER_SPEED);
        }

        if (newX !== prevPlayer.x || newY !== prevPlayer.y) {
          return { ...prevPlayer, x: newX, y: newY };
        }
        return prevPlayer;
      });

      animationFrameId.current = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // アニメーション開始
    animationFrameId.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId.current);
    };
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