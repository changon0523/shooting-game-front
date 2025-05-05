import React, { useState, useEffect, useRef } from 'react';

const getRandom = (min, max) => Math.random() * (max - min) + min;

const SquareAnimation = () => {
  const [squares, setSquares] = useState([]);
  const containerRef = useRef(null);
  const animationFrameId = useRef(null);

  const createSquare = () => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const size = getRandom(20, 50);
    const speed = getRandom(1, 5);
    const startSide = Math.random() < 0.5 ? 'left' : 'right';
    const initialX = startSide === 'left' ? -size : containerWidth;
    const initialY = getRandom(0, window.innerHeight - size);

    setSquares((prevSquares) => [
      ...prevSquares,
      {
        id: Date.now(),
        x: initialX,
        y: initialY,
        size,
        speed,
        direction: startSide === 'left' ? 1 : -1, // 1: 右へ, -1: 左へ
      },
    ]);
  };

  const updateSquares = () => {
    setSquares((prevSquares) =>
      prevSquares.map((square) => {
        const nextX = square.x + square.speed * square.direction;
        return { ...square, x: nextX };
      }).filter((square) => {
        if (!containerRef.current) return false;
        const containerWidth = containerRef.current.offsetWidth;
        return square.direction === 1 ? square.x < containerWidth + square.size : square.x > -square.size;
      })
    );

    animationFrameId.current = requestAnimationFrame(updateSquares);
  };

  useEffect(() => {
    const intervalId = setInterval(createSquare, 1000); // 1秒ごとに新しい四角を生成

    animationFrameId.current = requestAnimationFrame(updateSquares);

    return () => {
      clearInterval(intervalId);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {squares.map((square) => (
        //enemy_object
        <div
          key={square.id}
          style={{
            position: 'absolute',
            left: `${square.x}px`,
            top: `${square.y}px`,
            width: `${square.size}px`,
            height: `${square.size}px`,
            backgroundColor: 'white',
          }}
        />
      ))}
    </div>
  );
};

export default SquareAnimation;
