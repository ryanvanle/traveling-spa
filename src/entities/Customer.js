import CharacterModel from "../CharacterModel.js";
import * as ModelGenerator from "../utils/ModelGenerator.js";
import Entity from "./Entity.js";

export default class Customer extends Entity{
  constructor(startX, startY) {
    super(startX, startY);
    this.stats = {}
    this.model = new CharacterModel(false);
    this.model.hair = ModelGenerator.generateRandomHair();
    this.model.features = ModelGenerator.generateRandomFeatures();
    this.modelId = this.model.id;
  }

  onTileEnter(tile) {
    tile.characters.add(this.id);
  }

  onTileLeave(tile) {
    tile.characters.delete(this.id);
  }
}