import EventBus from './EventEmitter.js';
import Player from './entities/Player.js';
import Customer from './entities/Customer.js';
import DOMRenderer from './DOMRenderer.js';
import Ship from './Ship.js';
import { ACTION_TYPES } from './Constants.js';

export default class Game {
  constructor() {
    this.ship = new Ship();
    this.player = new Player(0, 0);

    this.customers = [new Customer(1,1), new Customer(2,2), new Customer(3,3)];
    this.renderer = new DOMRenderer("#game-area", 100);

    this.actionQueue = [];
    this.isProcessing = false;
  }

  init() {
    this.renderer.initGrid(this.ship);
    this.renderer.setupEvents();
    this.renderer.renderInitialEntities(this.player, this.customers);
    
    this.#initGameLogic();
  }

  #initGameLogic() {
    EventBus.on("input:grid-clicked", (targetPosition) => {
      this.processGridClick(targetPosition);
    });

    EventBus.on("input:customer-dropped", (payload) => {
      this.processCustomerDrop(payload);
    });
  }

  processCustomerDrop(payload) {
    for (let customer of this.customers) {
      if (customer.id === payload.id) {
        customer.updatePosition(payload.target, this.ship);
        break;
      }
    }
  }
    
  processGridClick(targetPosition) {
    // input checks for player character
    const isWithinBounds = this.ship.isWithinBounds(targetPosition.x, targetPosition.y);
    if (!isWithinBounds) {
      console.log("handle input not within game bounds");
      return;
    }

    const isAtCurrentPosition = this.player.position.x === targetPosition.x && this.player.position.y === targetPosition.y;
    const isDuplicateAction = this.actionQueue.some(action => action.target.x === targetPosition.x && action.target.y === targetPosition.y);

    if (isAtCurrentPosition || isDuplicateAction) {
      console.log("Action Queue: duplicate action");
      return;
    }
  
    let isMove = this.ship.isWalkableTile(targetPosition.x, targetPosition.y);
    let action = {
      type: isMove ? ACTION_TYPES.MOVE : ACTION_TYPES.INTERACT,
      target: targetPosition
    };

    this.actionQueue.push(action);
    EventBus.emit("queue:updated", this.actionQueue);
    this.processQueue();
  }

   async executeMovement(targetPosition) {
    let playerPosition = this.player.position;
    let path = this.#findPath({x: playerPosition.x, y: playerPosition.y}, targetPosition);

    if (!path) {
      console.log("executeMovement, no path found");
      return;
    }

    for (let i = 1; i < path.length; i++) {
      const nextStep = path[i];
      this.player.updatePosition(nextStep, this.ship);
      await new Promise(resolve => setTimeout(resolve, this.player.stats.speed));
    }

    console.log(this.ship.getTile(1,1))    
    console.log(path);
  }

  async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.actionQueue.length > 0) {
      const currentAction = this.actionQueue[0];
      EventBus.emit("queue:updated", this.actionQueue);

      switch (currentAction.type) {
        case ACTION_TYPES.MOVE:
          console.log("walk");
          await this.executeMovement(currentAction.target);
          break;
        case ACTION_TYPES.INTERACT:
          console.log("interact")
          await this.executeMovement(currentAction.target);
          break;
      }

      this.actionQueue.shift(); // late shift so we don't mess up the queue numbering
    }

    EventBus.emit("queue:updated", this.actionQueue);
    this.isProcessing = false;
  }


  #findPath(start, end) {

    console.log("findPath")

    function reconstructPath(parentMap, end) {
      const path = [];
      let current = end;

      while (current) {
        path.push(current);
        current = parentMap[`${current.x},${current.y}`];
      }

      return path.reverse();
    } 

    const directions = [
      [-1, 0], // left
      [1, 0], // right
      [0, -1], // top
      [0, 1] // down
    ]

    const queue = [start];
    const visited = new Set([start]);
    visited.add(`${start.x},${start.y}`);
    
    const parentMap = {};

    // bfs
    while (queue.length > 0) {
      const currentPosition = queue.shift();

      const isEnd = currentPosition.x === end.x && currentPosition.y === end.y;
      if (isEnd) {
        return reconstructPath(parentMap, end);
      }

      for (const direction of directions) {
        const directionX = direction[0];
        const directionY = direction[1];

        const nextDirectionX = directionX + currentPosition.x;
        const nextDirectionY = directionY + currentPosition.y;

        const nextDirectionString = `${nextDirectionX},${nextDirectionY}`;

        if (
          this.ship.isWithinBounds(nextDirectionX, nextDirectionY) &&
          this.ship.isWalkableTile(nextDirectionX, nextDirectionY) &&
          !visited.has(nextDirectionString)
        ) {
          visited.add(nextDirectionString);
          parentMap[nextDirectionString] = currentPosition;
          queue.push({ x: nextDirectionX, y: nextDirectionY});
        }
      } 
    }

    return null;
  }

}