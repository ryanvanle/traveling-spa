import EventBus from "./EventEmitter.js";

const TILE_PREFIX = "tile-type-";

export default class DOMRenderer {
  constructor(targetSelector, tileSize) {
    this.root = document.querySelector(targetSelector);
    this.tileSize = tileSize;
    this.container = null;
    this.entityElements = new Map();

    this.#setupListeners();
  }

  #setupListeners() {
    EventBus.on("entity:moved", (entity) => this.renderEntity(entity));
    EventBus.on("queue:updated", (queue) => this.renderMarkers(queue));    
    EventBus.on("tile:updated", (tile) => this.renderTile(tile));
  }

  setupEvents() {
    if (!this.container) {
      console.warn("domRenderer setupEvents, this.container is null");
    }

    this.container.addEventListener("click", (event) => {
      const targetPosition = this.getCoordsFromXY(event.clientX, event.clientY);
      EventBus.emit("input:grid-clicked", targetPosition);
    });

    this.#initDevToolsEvents();
  }

  #initDevToolsEvents() {

    let buttons = document.querySelectorAll("nav ul li button");
    buttons[0].addEventListener("click", (event) => {
      if (event.target.tagName === "BUTTON") {
        const actionType = event.target.dataset.action;
        EventBus.emit("devtools:mode-changed", actionType);
      }
    });
  }

  renderInitialEntities(player, customers) {
    this.renderEntity(player);
    for (const customer of customers) {
      this.renderEntity(customer);
    }
  }

  initGrid(shipState) {
    let shipContainer = document.createElement("div");
    shipContainer.id = "ship";
    shipContainer.style.gridTemplateColumns = `repeat(${shipState.columns}, ${this.tileSize}px)`;
    shipContainer.style.gridTemplateRows = `repeat(${shipState.rows}, ${this.tileSize}px)`;

    for (let i = 0; i < shipState.rows; i++) {
      for (let j = 0; j < shipState.columns; j++) {
        let currentTile = this.#generateTile(i, j, this.tileSize, shipState.getTile(i, j));

        
        if (!shipState.isWalkableTile(i, j)) {
          currentTile.classList.add("blocked");
        }

        currentTile.addEventListener("dragover", (event) => {
          event.preventDefault(); 
        });

        currentTile.addEventListener("drop", (event) => {
          event.preventDefault();
          
          const entityId = event.dataTransfer.getData("text/plain");
          
          const targetPosition = {
            x: parseInt(currentTile.dataset.row),
            y: parseInt(currentTile.dataset.column)
          };

          EventBus.emit("input:customer-dropped", { id: entityId, target: targetPosition });
        });

        shipContainer.appendChild(currentTile);
      }
    }
    
    this.root.appendChild(shipContainer);
    this.container = shipContainer;
  }

  #generateTile(row, column, size, tileData) {
      let tile = document.createElement("div");
      tile.style.width = `${size}px`;
      tile.style.height = `${size}px`;
      tile.dataset.row = row;
      tile.dataset.column = column;
      
      if (!tileData) {
        console.warn("DOMRenderer: generateTile, tileData is null", tileData);
        return;
      }

      tile.classList.add(this.#generateTileClassName(tileData.type));
      return tile;
  }

  #generateTileClassName(tileType) {
    if (!tileType) {
      console.warn("DOMRenderer: generateTileClassName is null", tileType);
      return null;
    }
    
    return `${TILE_PREFIX}${tileType}`;
  }


  renderTile(tileData) {
    if (!tileData) {
      console.warn("DOMRenderer renderTile: tileData is null", tileData);
      return;
    }

    let tileElement = this.getTileElement(tileData.row, tileData.column);
    if (!tileElement) {
      console.warn("DOMRenderer renderTile: tileElement is null", tileElement);
      return;
    }

    // only one type of class per tile at the moment
    // TODO determine if you want to keep it like this, where a tile can only have 1 class
    let newTileClassName = this.#generateTileClassName(tileData.type);

    let tileClasslist = Array.from(tileElement.classList)
      .filter(className => className.includes(TILE_PREFIX))
      .filter(className => !className.includes(newTileClassName));

    for (let tileClass of tileClasslist) {
      tileElement.classList.remove(tileClass);
    }

    tileElement.classList.add(newTileClassName);
  }

  
  getCoordsFromXY(clientX, clientY) {
    const rectangle = this.container.getBoundingClientRect();
    const x = clientX - rectangle.left;
    const y = clientY - rectangle.top;

    return {
      x: Math.floor(y / this.tileSize),
      y: Math.floor(x / this.tileSize)
    };
  }

  getTileElement(r, c) {
    return this.container.querySelector(`[data-row="${r}"][data-column="${c}"]`);
  }

  renderEntity(entity) {
    if (entity.position.prevX !== null && entity.position.prevY !== null) {
      const oldTile = this.getTileElement(entity.position.prevX, entity.position.prevY);
      if (oldTile) {
        oldTile.style.backgroundColor = "";
        oldTile.classList.remove("player-tile");
      }
    }

    let modelElement = this.entityElements.get(entity.id);
    if (!modelElement) {
      modelElement = this.#buildCharacterDOM(entity);
      this.entityElements.set(entity.id, modelElement);
    }

    const newTile = this.getTileElement(entity.position.x, entity.position.y);
    if (newTile) {
      newTile.appendChild(modelElement);
      if (entity.color) newTile.style.backgroundColor = entity.color;
      newTile.classList.add("player-tile");
    }
  }

  renderMarkers(actionQueue) { 
    // remove all markers
    const existingMarkers = this.container.querySelectorAll(".action-marker");
    for (const tileElement of existingMarkers) {
      tileElement.classList.remove("action-marker");
      tileElement.removeAttribute("data-index");
    }

    // redisplay all of them
    for (const [i, action] of actionQueue.entries()) {
      const tile = this.getTileElement(action.target.x, action.target.y);
      if (!tile) continue;
      tile.classList.add("action-marker");
      tile.setAttribute('data-index', i + 1);
    }
  }

  #buildCharacterDOM(entity) {

    const model = entity.model;
    let modelContainer = document.createElement("div");
    modelContainer.id = model.id;


    if (model.isPlayer) {
      modelContainer.classList.add("player-model");

      // anti-drag logic for player model
      modelContainer.setAttribute("draggable", "false");
      modelContainer.addEventListener("dragstart", (event) => {
        event.preventDefault();
      });
    }

    if (!model.isPlayer) {
      modelContainer.classList.add("character-model");

      // drag logic
      modelContainer.setAttribute("draggable", "true");

      modelContainer.addEventListener("dragstart", (event) => {
        event.stopPropagation();
        modelContainer.classList.add("dragging");
        event.dataTransfer.setData("text/plain", entity.id);
      });

      modelContainer.addEventListener("dragend", () => {
        modelContainer.classList.remove("dragging");
      });
    }


    this.#generateCharacterDOM(model, modelContainer);

    return modelContainer;
  }

  #generateCharacterDOM(model, modelContainer) {
    let head = document.createElement("img");
    head.src = "model/head/head.svg";

    let eyebrowLeft = document.createElement("img");
    eyebrowLeft.src = "model/eyebrow/" + model.features.eyebrows;
    eyebrowLeft.classList.add("eyebrow-left");

    let eyebrowRight = document.createElement("img");
    eyebrowRight.src = "model/eyebrow/" + model.features.eyebrows;
    eyebrowRight.classList.add("eyebrow-right");

    let eyeLeft = document.createElement("img");
    eyeLeft.src = "model/eye/" + model.features.eyes;
    eyeLeft.classList.add("eye-left");

    let eyeRight = document.createElement("img");
    eyeRight.src = "model/eye/" + model.features.eyes;
    eyeRight.classList.add("eye-right");

    let mouth = document.createElement("img");
    mouth.src = "model/mouth/" + model.features.mouth;
    mouth.classList.add("mouth");

    let hairBack = document.createElement("img");
    hairBack.src = "model/hair/back/" + model.hair.style.back.id + ".svg";
    hairBack.classList.add("hair-back");
    hairBack.style.width = model.hair.style.back.width;
    hairBack.style.top = model.hair.style.back.top;
    hairBack.style.left = model.hair.style.back.left;

    let hairFront = document.createElement("img");
    hairFront.src = "model/hair/front/" + model.hair.style.front.id + ".svg";
    hairFront.classList.add("hair-front");
    hairFront.style.width = model.hair.style.front.width;
    hairFront.style.top = model.hair.style.front.top;
    hairFront.style.left = model.hair.style.front.left;
    
    modelContainer.appendChild(head);
    modelContainer.appendChild(eyebrowLeft);
    modelContainer.appendChild(eyebrowRight);
    modelContainer.appendChild(eyeLeft);
    modelContainer.appendChild(eyeRight);
    modelContainer.appendChild(mouth);
    modelContainer.appendChild(hairBack);
    modelContainer.appendChild(hairFront);
  }
}