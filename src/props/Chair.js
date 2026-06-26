import Entity from "../entities/Entity";
import PropModel from "../PropModel";

export default class Chair extends Entity {
  static type = "chair";

  constructor(startX, startY) {
    super(startX, startY);
    this.occupant;
    this.currentState;
    this.states;

    this.isInteractable = false; 
    this.model = new PropModel(Chair.type);
    this.modelId = this.model.id;
  }
  
  getIsOccupied() {
    return this.occupant !== null && this.occupant !== undefined;
  }

  getCurrentState() {
    return this.currentState;
  }

  onOccupantEnter(character) {
    if (this.occupant) {
      console.warn("Chair: onOccupantEnter, this.occupant must be null", this.occupant);
      return;
    }

    this.occupant = character;
  }

  onOccupantLeave() {
    if (!this.occupant) {
      console.warn("Chair: onOccupantLeave, this.occupant is null", this.occupant);
      return;
    }

    this.occupant = null;
  }

  interactProp() {
     // you cannot interact with a chair for example but can place them onto a chair which is different
    if (!this.isInteractable) {
      return;
    }

    // isValidInteraction
    //  -- not empty
    //  -- matches customers intention (matches the object)
    //     -- this would also include them being done with the machine like
    //  -- is not already in use (idle)
  
    
  }

  #updateState() {

  }

  onTileEnter(tile) {
    tile.props.add(this.id);
  }

  onTileLeave(tile) {
    tile.props.remove(this.id);
  }
}