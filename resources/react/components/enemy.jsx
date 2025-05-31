import React, { useState, useEffect, useRef, useCallback } from 'react';

const getRandom = (min, max) => Math.random() * (max - min) + min;

// 定数
const MAX_ENEMIES_PER_SECOND = 1; // 1秒間に生成する敵の最大数
const MS_PER_ENEMY = 1000 / MAX_ENEMIES_PER_SECOND; // 1体あたりの生成に必要なミリ秒

// ここに敵の画像のパスを追加します
// 例: import enemyImage from '../assets/enemy.png';
// 実際のプロジェクトのファイル構造に合わせてパスを調整してください。
const ENEMY_IMAGE_URL = 'resources/assets/img/kyantama1-preview.png';

// ★新しく追加する揺れ関連の定数★
const SWAY_AMPLITUDE = 30; // 左右に揺れる最大幅（ピクセル）
const SWAY_SPEED = 0.05; // 揺れの速度（大きいほど速く揺れる）

const Enemy = () => {
  const [squares, setSquares] = useState([]);
  const containerRef = useRef(null);
  const animationFrameId = useRef(null);
  const lastSpawnTime = useRef(0);
  const frameCount = useRef(0); // フレーム数をカウントして揺れの計算に使う

  const createSquare = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const size = getRandom(80, 120);
    const speed = 3;
    const initialX = getRandom(0, containerWidth - size);
    const initialY = -size;
    const swayOffset = getRandom(0, Math.PI * 2); // 各敵にランダムな揺れの開始オフセットを与える (0から2π)

    setSquares((prevSquares) => [
      ...prevSquares,
      {
        id: Date.now(),
        initialX: initialX, // 初期X座標を保存
        y: initialY,
        size,
        speed,
        swayOffset: swayOffset, // 揺れのオフセット
      },
    ]);
  }, []);

  const gameLoop = useCallback((currentTime) => {
    // 敵の生成ロジック
    if (currentTime - lastSpawnTime.current > MS_PER_ENEMY) {
      createSquare();
      lastSpawnTime.current = currentTime;
    }

    // フレーム数を更新
    frameCount.current++;

    // 敵の位置更新と削除ロジック
    setSquares((prevSquares) =>
      prevSquares
        .map((square) => {
          const nextY = square.y + square.speed;
          // ★X座標をサイン関数で計算して左右に揺らす★
          // square.initialX を基準に揺れるようにします
          const nextX = square.initialX + Math.sin(frameCount.current * SWAY_SPEED + square.swayOffset) * SWAY_AMPLITUDE;
          return { ...square, x: nextX, y: nextY }; // xプロパティを追加/更新
        })
        .filter((square) => square.y < containerRef.current.offsetHeight + square.size)
    );

    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [createSquare]); // createSquareが依存している

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [gameLoop]); // gameLoopが依存している

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {squares.map((square) => (
        <div
          key={square.id}
          style={{
            position: 'absolute',
            left: `${square.x}px`, // ★X座標をsquare.xから取得するように変更★
            top: `${square.y}px`,
            width: `${square.size}px`,
            height: `${square.size}px`,
            backgroundImage: `url(${ENEMY_IMAGE_URL})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
      ))}
    </div>
  );
};

export default Enemy;