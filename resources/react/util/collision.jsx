/**
 * 衝突判定ユーティリティ関数集
 * シューティングゲームで使用する様々な衝突判定アルゴリズムを提供します
 */

/**
 * 矩形同士の衝突判定（AABB - Axis-Aligned Bounding Box）
 * @param {Object} rect1 - 1つ目の矩形 {x, y, width, height}
 * @param {Object} rect2 - 2つ目の矩形 {x, y, width, height}
 * @returns {boolean} 衝突している場合はtrue
 */
export const checkRectCollision = (rect1, rect2) => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

/**
 * 円同士の衝突判定
 * @param {Object} circle1 - 1つ目の円 {x, y, radius}
 * @param {Object} circle2 - 2つ目の円 {x, y, radius}
 * @returns {boolean} 衝突している場合はtrue
 */
export const checkCircleCollision = (circle1, circle2) => {
  const dx = circle1.x - circle2.x;
  const dy = circle1.y - circle2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance < circle1.radius + circle2.radius;
};

/**
 * 矩形と円の衝突判定
 * @param {Object} rect - 矩形 {x, y, width, height}
 * @param {Object} circle - 円 {x, y, radius}
 * @returns {boolean} 衝突している場合はtrue
 */
export const checkRectCircleCollision = (rect, circle) => {
  // 円の中心と矩形の最近接点を計算
  const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

  // 最近接点と円の中心との距離を計算
  const dx = closestX - circle.x;
  const dy = closestY - circle.y;
  const distanceSquared = dx * dx + dy * dy;

  return distanceSquared < circle.radius * circle.radius;
};

/**
 * 三角形の衝突判定（プレイヤーの戦闘機などが三角形の場合）
 * @param {Array} triangle - 3つの頂点を持つ配列 [{x, y}, {x, y}, {x, y}]
 * @param {Object} point - 点 {x, y}
 * @returns {boolean} 点が三角形内にある場合はtrue
 */
export const checkPointInTriangle = (triangle, point) => {
  const [p1, p2, p3] = triangle;

  // 3つの小三角形の面積の合計が元の三角形の面積と等しいかチェック
  const areaOriginal = Math.abs(
    (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2
  );

  const area1 = Math.abs(
    (point.x * (p2.y - p3.y) +
      p2.x * (p3.y - point.y) +
      p3.x * (point.y - p2.y)) /
      2
  );
  const area2 = Math.abs(
    (p1.x * (point.y - p3.y) +
      point.x * (p3.y - p1.y) +
      p3.x * (p1.y - point.y)) /
      2
  );
  const area3 = Math.abs(
    (p1.x * (p2.y - point.y) +
      p2.x * (point.y - p1.y) +
      point.x * (p1.y - p2.y)) /
      2
  );

  return Math.abs(area1 + area2 + area3 - areaOriginal) < 0.00001;
};

/**
 * 複数のオブジェクト間の衝突チェックを最適化するグリッドベースの空間分割
 * 多数のオブジェクトがある場合に計算量を減らす
 * @param {Array} objects - 衝突チェック対象のオブジェクト配列
 * @param {number} cellSize - グリッドのセルサイズ
 * @param {Function} collisionFn - 2つのオブジェクト間の衝突判定関数
 * @returns {Array} 衝突しているオブジェクトのペア配列
 */
export const detectCollisionsWithGrid = (objects, cellSize, collisionFn) => {
  const grid = {};
  const collisions = [];

  // オブジェクトをグリッドに配置
  objects.forEach((obj, index) => {
    const cellX = Math.floor(obj.x / cellSize);
    const cellY = Math.floor(obj.y / cellSize);

    // このオブジェクトが影響するセルの範囲を計算
    const cellWidth = Math.ceil(obj.width / cellSize) || 1;
    const cellHeight = Math.ceil(obj.height / cellSize) || 1;

    // 該当するすべてのセルにオブジェクトを登録
    for (let x = cellX; x < cellX + cellWidth; x++) {
      for (let y = cellY; y < cellY + cellHeight; y++) {
        const key = `${x},${y}`;
        if (!grid[key]) grid[key] = [];
        grid[key].push({ index, obj });
      }
    }
  });

  // 同じセルにあるオブジェクト同士で衝突判定
  Object.values(grid).forEach((cell) => {
    for (let i = 0; i < cell.length; i++) {
      for (let j = i + 1; j < cell.length; j++) {
        const objA = cell[i].obj;
        const objB = cell[j].obj;

        // 既に他のセルで判定済みのペアはスキップ
        const pairKey = `${Math.min(cell[i].index, cell[j].index)},${Math.max(
          cell[i].index,
          cell[j].index
        )}`;
        if (collisions.some((c) => c.key === pairKey)) continue;

        if (collisionFn(objA, objB)) {
          collisions.push({
            key: pairKey,
            a: objA,
            b: objB,
          });
        }
      }
    }
  });

  return collisions;
};

/**
 * 敵とミサイルの衝突判定を行う
 * @param {Array} enemies - 敵オブジェクトの配列
 * @param {Array} missiles - ミサイルオブジェクトの配列
 * @returns {Array} 衝突した{enemy, missile}のペア配列
 */
export const checkEnemyMissileCollisions = (enemies, missiles) => {
  const collisions = [];

  enemies.forEach((enemy) => {
    missiles.forEach((missile) => {
      if (checkRectCollision(enemy, missile)) {
        collisions.push({ enemy, missile });
      }
    });
  });

  return collisions;
};
