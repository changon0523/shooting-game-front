// ゲームエリアの設定
export const AREA_WIDTH = 800;  // ゲームエリアの幅
export const AREA_HEIGHT = 600; // ゲームエリアの高さ

// プレイヤーの設定
export const PLAYER_WIDTH = 40;   // プレイヤーの幅
export const PLAYER_HEIGHT = 30;  // プレイヤーの高さ
export const PLAYER_SPEED = 30;    // プレイヤーの移動速度
export const PLAYER_INITIAL_X = AREA_WIDTH / 2 - PLAYER_WIDTH / 2;  // プレイヤーの初期X座標
export const PLAYER_INITIAL_Y = AREA_HEIGHT - PLAYER_HEIGHT - 20;    // プレイヤーの初期Y座標

// ミサイルの設定
export const MISSILE_WIDTH = 4;      // ミサイルの幅
export const MISSILE_HEIGHT = 12;    // ミサイルの高さ
export const MISSILE_SPEED = 10;     // ミサイルの速度
export const MISSILE_COOLDOWN = 250; // ミサイル発射のクールダウン（ミリ秒）

// 敵の設定
export const ENEMY_MIN_SIZE = 20;    // 敵の最小サイズ
export const ENEMY_MAX_SIZE = 40;    // 敵の最大サイズ
export const ENEMY_MIN_SPEED = 1;    // 敵の最小速度
export const ENEMY_MAX_SPEED = 3;    // 敵の最大速度
export const ENEMY_SPAWN_INTERVAL = 1000; // 敵の出現間隔（ミリ秒）
