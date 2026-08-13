export class SpatialHash {
  constructor(cellSize) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }

  _getKey(x, y) {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    return ((cx & 0xFFFF) << 16) | (cy & 0xFFFF);
  }

  insert(entity) {
    const key = this._getKey(entity.x, entity.y);
    let cell = this.grid.get(key);
    if (!cell) {
      cell = [];
      this.grid.set(key, cell);
    }
    cell.push(entity);
  }

  query(x, y, radius) {
    const startX = Math.floor((x - radius) / this.cellSize);
    const endX = Math.floor((x + radius) / this.cellSize);
    const startY = Math.floor((y - radius) / this.cellSize);
    const endY = Math.floor((y + radius) / this.cellSize);

    const found = [];
    for (let i = startX; i <= endX; i++) {
      for (let j = startY; j <= endY; j++) {
        const key = ((i & 0xFFFF) << 16) | (j & 0xFFFF);
        const cell = this.grid.get(key);
        if (cell) {
          for (let k = 0; k < cell.length; k++) {
             found.push(cell[k]);
          }
        }
      }
    }
    return found;
  }
  
  clear() {
    for (const cell of this.grid.values()) {
      cell.length = 0;
    }
  }
}
