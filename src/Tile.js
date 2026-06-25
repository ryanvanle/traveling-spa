export default class Tile {
  constructor(row, column, isWalkable = true) {
    this.row = row;
    this.column = column;
    this.isWalkable = isWalkable;
    this.type = "floor";

    this.characters = new Set();
    this.fixtures = new Set();
  }

  getCharacters() {
    return Array.from(this.characters);
  }

  getFixtures() {
    return Array.from(this.fixtures);
  }
}
