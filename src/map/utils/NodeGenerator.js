import Node from "../Node.js";

/**
 * implementation of interpretation of ftl map generation
 * https://www.reddit.com/r/ftlgame/comments/fcfdt3/how_the_beacon_map_is_generated/
 */
export default class NodeGenerator {
  constructor(rows = 4, cols = 6, cellSize = 100) {
    this.cols = cols;
    this.rows = rows;
    this.cellSize = cellSize;
    this.grid = Array.from(Array(this.rows), () => new Array(this.cols));
  }

  generateNodes() {
    const nodesList = [];
    const nodePositions = this.generatePoints();

    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = 0; j < nodePositions[0].length; j++) {
        const currentPosition = nodePositions[i][j];
        const currentNode = new Node(`node-${i}-${j}`, currentPosition);
        nodesList.push(currentNode);
      }
    }

    return nodesList;
  }

  generatePoints() {
    this.grid = Array.from(Array(this.rows), () => new Array(this.cols));

    // per each cell spawn or dont spawn an island, and place it in a random position within in the cell offset by the cell's position
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let randomPosition = this.generateRandomPosition(i, j, this.cellSize);
        this.grid[i][j] = randomPosition;
      }
    }

    return this.grid;
  }

  generateRandomPosition(rowIndex, colIndex, cellSize) {
    const PADDING = 5;

    const minOffset = PADDING;
    const maxOffset = cellSize - PADDING;

    const rowOffset = rowIndex * cellSize;
    const colOffset = colIndex * cellSize;

    const randomPosition = {
      x: this.getRandomInt(minOffset, maxOffset) + colOffset,
      y: this.getRandomInt(minOffset, maxOffset) + rowOffset
    }

    return randomPosition;
  }

  /**
   * Returns a random integer between min (inclusive) and max (inclusive).
   * The value is no lower than min (or the next integer greater than min
   * if min isn't an integer) and no greater than max (or the next integer
   * lower than max if max isn't an integer).
   * Using Math.round() will give you a non-uniform distribution!
   */
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

