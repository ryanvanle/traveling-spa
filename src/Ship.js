import Tile from "./Tile.js";

export default class Ship {
  constructor() {
    this.rows = 8;
    this.columns = 12;
    this.grid = this.#generateGrid();
  }

  #generateGrid() {
    const grid = [];
    for (let row = 0; row < this.rows; row++) {
      const rowArray = [];
      for (let col = 0; col < this.columns; col++) {
        rowArray.push(new Tile(row, col, true));
      }
      grid.push(rowArray);
    }
    return grid;
  }

  getTile(r, c) {
    if (!this.isWithinBounds(r, c)) return null;
    return this.grid[r][c];
  }

  isWalkableTile(r, c) {
    const tile = this.getTile(r, c);
    return tile ? tile.isWalkable : false;
  }

  isWithinBounds(r, c) {
    return r >= 0 && r < this.rows && c >= 0 && c < this.columns;
  }

  setTileBlocked(r, c, isBlocked) {
    const tile = this.getTile(r, c);
    if (tile) {
      tile.isWalkable = !isBlocked;
    }
  }
}
