import React, { useState, useEffect } from 'react';
import '../css/App.css'
import Enemy from './components/Enemy';


// 定数
const AREA_WIDTH = 800;  // 発射エリアの幅
const AREA_HEIGHT = 500; // 発射エリアの高さ
const MISSILE_WIDTH = 5;
const MISSILE_HEIGHT = 15;
const MISSILE_SPEED = 3; // ミサイルの速度 (ピクセル/フレーム)
const PLAYER_WIDTH = 30;  // 例: プレイヤーの幅
const PLAYER_HEIGHT = 20; // 例: プレイヤーの高さ
const PLAYER_SPEED = 20;

function App() {
  const [missiles, setMissiles] = useState([]); // 発射されたミサイルのリスト (配列)

  const [player, setPlayer] = useState({
    x: AREA_WIDTH / 2 - PLAYER_WIDTH / 2, // 初期位置X (中央)
    y: AREA_HEIGHT - PLAYER_HEIGHT - 10, // 初期位置Y (下端固定)
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
  });
  useEffect(() => {
    const handleKeyDown = (e) => {
      // プレイヤー移動 (矢印キー)
      setPlayer((prevPlayer) => {
        // 現在の座標をコピー
        let newX = prevPlayer.x;
        let newY = prevPlayer.y; // Y座標も更新対象に

        // 押されたキーに応じて座標を更新
        if (e.key === 'ArrowLeft') {
          newX = Math.max(0, prevPlayer.x - PLAYER_SPEED); // 左端制限
        } else if (e.key === 'ArrowRight') {
          newX = Math.min(AREA_WIDTH - prevPlayer.width, prevPlayer.x + PLAYER_SPEED); // 右端制限
        } else if (e.key === 'ArrowUp') { // ★★★ 上移動を追加 ★★★
          newY = Math.max(0, prevPlayer.y - PLAYER_SPEED); // 上端制限 (y=0)
        } else if (e.key === 'ArrowDown') { // ★★★ 下移動を追加 ★★★
          newY = Math.min(AREA_HEIGHT - prevPlayer.height, prevPlayer.y + PLAYER_SPEED); // 下端制限
        }

        // 更新された座標を持つ新しい player オブジェクトを返す
        // XかYが実際に変更された場合のみ更新（必須ではないが最適化）
        if (newX !== prevPlayer.x || newY !== prevPlayer.y) {
            return { ...prevPlayer, x: newX, y: newY };
        }
        // 変更がなければ元の state を返す
        return prevPlayer;
      });

      // ミサイル発射 (スペースキー)
      if (e.key === ' ') {
        e.preventDefault(); // ページのスクロールを防ぐ

        // 現在のプレイヤーの位置からミサイルを生成
        const newMissile = {
          id: Date.now(),
          x: player.x + player.width / 2 - MISSILE_WIDTH / 2, // プレイヤーの中央から発射
          y: player.y, // プレイヤーの上端から発射
          width: MISSILE_WIDTH,
          height: MISSILE_HEIGHT,
        };
        // ミサイルリストに追加
        setMissiles((prevMissiles) => [...prevMissiles, newMissile]);
      }
    };

    // イベントリスナーを登録
    window.addEventListener('keydown', handleKeyDown);

    // クリーンアップ関数: コンポーネントがアンマウントされるときにリスナーを削除
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [player]); // player state が変更されたときにリスナー内の player 座標が最新になるように依存配列に追加

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
    <div className="App text-center my-20 mx-auto relative overflow-hidden text-white">
      <h1 className='text-black'>ミサイル発射デモ</h1>
      <div
        className="launch-area mx-auto relative bg-gray-900"
        style={{ width: `${AREA_WIDTH}px`, height: `${AREA_HEIGHT}px` }}
      >
        <Enemy />
        
        <div
          className="player bg-blue-500 absolute" // CSSクラスまたはスタイルで見た目を定義
          style={{
            left: `${player.x}px`,
            top: `${player.y}px`,
            width: `${player.width}px`,
            height: `${player.height}px`,
          }}
        />

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
    </div>
  );
}

export default App;
