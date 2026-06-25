import Entity from "./Entity.js";
import CharacterModel from "../CharacterModel.js";
import * as ModelGenerator from "../utils/ModelGenerator.js";

export default class Player extends Entity {
  constructor(x, y) {
    super(x, y); 

    this.stats.speed = 100;
    this.model = new CharacterModel(true);
    this.model.hair = ModelGenerator.generateRandomHair();
    this.model.features = ModelGenerator.generateRandomFeatures();
    this.modelId = this.model.id;

    this.color = "pink";
  }

  onTileEnter(tile) {
    tile.characters.add(this.id);
  }

  onTileLeave(tile) {
    tile.characters.delete(this.id);
  }
}