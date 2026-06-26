const TYPE_LIST = {
  "floor": {
    isWalkable: true, 
    isEntityPlaceable: true,
  },
  "table" : {
    isWalkable: false,
    isEntityPlaceable: false,
  }
}

export default class Tile {
  constructor(row, column, type = "floor") {
    this.row = row;
    this.column = column;
    this.characters = new Set();
    this.fixtures = new Set();
    this.setType(type);
  }

  getCharacters() {
    return Array.from(this.characters);
  }

  getFixtures() {
    return Array.from(this.fixtures);
  }

  setType(type) {
    if (!TYPE_LIST[type]) {
      console.warn("setType: invalid type", type);
      return;
    }

    this.type = type;
    this.isWalkable = TYPE_LIST[type].isWalkable;
    this.isEntityPlaceable = TYPE_LIST[type].isEntityPlaceable;
  }
}
