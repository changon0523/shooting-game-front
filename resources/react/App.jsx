import React, { useState, useEffect, useCallback } from 'react';
import '../css/App.css'
import Enemy from './components/Enemy.jsx';

// 定数
const AREA_WIDTH = 400;  // 発射エリアの幅
const AREA_HEIGHT = 500; // 発射エリアの高さ
const MISSILE_WIDTH = 5;
const MISSILE_HEIGHT = 15;
const MISSILE_SPEED = 5; // ミサイルの速度 (ピクセル/フレーム)
const FIRE_POSITION_X = AREA_WIDTH / 2 - MISSILE_WIDTH / 2; // 発射位置 (X座標中央)
const FIRE_POSITION_Y = AREA_HEIGHT - MISSILE_HEIGHT - 10; // 発射位置 (Y座標下端付近)

function App() {
  const [missiles, setMissiles] = useState([]); // 発射されたミサイルのリスト (配列)

  // ミサイル発射ボタンが押されたときの処理
  const handleFire = useCallback(() => {
    const newMissile = {
      id: Date.now(), // ユニークID（簡易的）
      x: FIRE_POSITION_X,
      y: FIRE_POSITION_Y,
      width: MISSILE_WIDTH,
      height: MISSILE_HEIGHT,
    };
    // ミサイルリストに新しいミサイルを追加
    setMissiles((prevMissiles) => [...prevMissiles, newMissile]);
  }, []); // この関数は依存関係なし

  // アニメーションループ (ミサイルの移動と削除)
  useEffect(() => {
    const gameLoop = () => {
      // ミサイルの位置を更新し、画面外に出たものを削除
      setMissiles((prevMissiles) =>
        prevMissiles
          .map(m => ({
            ...m,
            y: m.y - MISSILE_SPEED // Y座標を減らして上に移動
          }))
          .filter(m => m.y + m.height > 0) // 画面上端より内側にあるミサイルだけ残す
      );

      // 次のフレームを要求
      requestAnimationFrame(gameLoop);
    };

    // ループを開始
    const animationFrameId = requestAnimationFrame(gameLoop);

    // コンポーネントがアンマウントされたらループを停止
    return () => cancelAnimationFrame(animationFrameId);
  }, []); // このeffectはマウント時に一度だけ実行

  return (
    <div className="App text-center bg-gray-900 my-20 mx-auto relative overflow-hidden text-white">
      <h1>ミサイル発射デモ</h1>
      <div
        className="launch-area mx-auto"
        style={{ width: `${AREA_WIDTH}px`, height: `${AREA_HEIGHT}px` }}
      >
        <Enemy />
        
        {/* 発射されたミサイルを描画 */}
        {missiles.map((missile) => (
          <div
            key={missile.id}
            className="missile bg-yellow-400 absolute"
            style={{
              left: `${missile.x}px`,
              top: `${missile.y}px`,
              width: `${missile.width}px`,
              height: `${missile.height}px`,
            }}
          />
        ))}
      </div>
      <button onClick={handleFire}>発射！</button>
    </div>
  );
}

export default App;
