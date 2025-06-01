import React, { useState, useEffect } from "react";
import "../css/App.css";
import GameArea from "./components/GameArea";
import {
  AREA_WIDTH,
  AREA_HEIGHT,
  MISSILE_WIDTH,
  MISSILE_HEIGHT,
  MISSILE_SPEED,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
} from "./constants/gameConstants";

function App() {
  const [missiles, setMissiles] = useState([]);
  const [player, setPlayer] = useState({
    x: AREA_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: AREA_HEIGHT - PLAYER_HEIGHT - 10,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
  });

  // ミサイル発射処理
  const handleMissileShoot = (playerPosition) => {
    const newMissile = {
      id: Date.now(),
      x: playerPosition.x + playerPosition.width / 2 - MISSILE_WIDTH / 2,
      y: playerPosition.y,
      width: MISSILE_WIDTH,
      height: MISSILE_HEIGHT,
    };
    setMissiles((prev) => [...prev, newMissile]);
  };

  // アニメーションループ (ミサイルの移動と削除)
  // ミサイル移動のアニメーションループ
  useEffect(() => {
    const gameLoop = () => {
      setMissiles((prevMissiles) =>
        prevMissiles
          .map((m) => ({
            ...m,
            y: m.y - MISSILE_SPEED,
          }))
          .filter((m) => m.y + m.height > 0)
      );
      requestAnimationFrame(gameLoop);
    };

    const animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="App text-center mx-auto relative overflow-hidden text-white min-h-screen bg-gradient-to-b from-gray-800 to-black py-8">
      <h1 className="text-white text-4xl font-bold mb-4">
        シューティングゲーム
      </h1>
      <GameArea
        player={player}
        missiles={missiles}
        onMissileShoot={handleMissileShoot}
        onPlayerMove={setPlayer}
      />
    </div>
  );
}

export default App;
