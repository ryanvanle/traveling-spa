export default class CharacterModel {
  constructor(isPlayer) {
    this.id = crypto.randomUUID();
    this.isPlayer = isPlayer === true;

    this.hair = {
      style: null,
      colorFill: "black",
      colorStroke: "black",
    }

    this.features = {
      mouth: null,
      eyes: null,
      eyebrows: null,
      skinColor: "white"
    }
  }
}