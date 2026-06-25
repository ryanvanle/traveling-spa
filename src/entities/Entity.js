import EventBus from '../EventEmitter.js';

export default class Entity {
  constructor(startX, startY) {
    this.id = crypto.randomUUID();
    this.position = {
      x: startX,
      y: startY,
      prevX: null,
      prevY: null, 
    };

    this.stats = {}; 
  }

  updatePosition(newPosition, shipState) {
    if (this.position.prevX !== null && this.position.prevY !== null) {
      const oldTile = shipState.getTile(this.position.prevX, this.position.prevY);
      if (oldTile) {
        this.onTileLeave(oldTile);
      }
    }

    this.position.prevX = this.position.x;
    this.position.prevY = this.position.y;
    this.position.x = newPosition.x;
    this.position.y = newPosition.y;

    const newTile = shipState.getTile(this.position.x, this.position.y);
    if (newTile) {
      this.onTileEnter(newTile);
    }

    EventBus.emit("entity:moved", this);
  }

  destroy(shipState) {
    const currentTile = shipState.getTile(this.position.x, this.position.y);
    if (currentTile) {
      this.onTileLeave(currentTile);
    }
    EventBus.emit("entity:destroyed", this.id);
  }

  // Placeholder methods for subclasses to override
  onTileEnter(tile) {

  }

  onTileLeave(tile) {

  }
}