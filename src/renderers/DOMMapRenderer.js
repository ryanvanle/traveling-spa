import EventBus from "../EventEmitter.js";

const CONTAINER_TAG = "world-map-area";
const CONTENT_TAG = "world-map-content";

export default class DOMMapRenderer {
  constructor() {
    this.root = document.getElementById(CONTAINER_TAG);
    this.container = null;
    this.entityElements = new Map();
    this.#setupListeners();
  }

  #setupListeners() {
    EventBus.on("worldMap:open", (worldMap) => this.renderOpenMap(worldMap));
    EventBus.on("worldMap:close", (worldMap) => this.renderCloseMap(worldMap));
  }

  init(worldMap) {
    this.initWorldMap(worldMap);
    this.setupEvents();
    // this.renderInitialMap()
  }

  setupEvents() {
    if (!this.container) {
      console.warn("DOMMapRenderer setupEvents, this.container is null");
    }

    let buttons = document.querySelectorAll("nav ul li button");

    let worldMapButton = buttons[3];

    let worldMapDialog = document.getElementById("map");
    worldMapButton.addEventListener("click", (event) => {
      if (event.target.tagName === "BUTTON") {
        // const actionType = event.target.dataset.action;
        // EventBus.emit("worldMap:button-pressed", actionType);
      }

      worldMapDialog.open ? worldMapDialog.close() : worldMapDialog.show();
      EventBus.emit("worldMap:open-button-map");
      // this.#updateMapElements()
      
      
      // console.log("2", worldMapDialog.offsetHeight, worldMapDialog.offsetWidth);

    });
  
    // this.container.addEventListener("click", (event) => {
      // const targetPosition = this.getCoordsFromXY(event.clientX, event.clientY);
      // EventBus.emit("input:grid-clicked", targetPosition);
    // });

    // this.#initDevToolsEvents();
  }

  initWorldMap(worldMap) {

    const worldMapContainer = document.createElement("dialog");
    worldMapContainer.id = "map";
    
    const mapElementsContainer = document.createElement("div");
    mapElementsContainer.id = CONTENT_TAG;

    this.root.appendChild(worldMapContainer);
    worldMapContainer.append(mapElementsContainer);
    this.container = worldMapContainer;
  }

  #generateIsland(island, worldSize, containerSize) {
    const islandElement = document.createElement("div");
    islandElement.classList.add("island");

    islandElement.style.top = `${parseInt(island.position.x)}px`;
    islandElement.style.left = `${parseInt(island.position.y)}px`;

    // console.log("generateIsland", island);
    return islandElement;
  }

  #generateEdge(edge) {
    const edgeElement = document.createElement("div");
    // console.log("generateEdge", edge);
    return edgeElement;
  }



  renderOpenMap(worldMap) {
    console.log("renderOpenMap", worldMap);

    const mapElement = document.getElementById(CONTENT_TAG);
    mapElement.innerHTML = "";

    const containerSize = {
      width: mapElement.offsetWidth,
      height: mapElement.offsetHeight
    }

    const islands = worldMap.getIslands();
    const edges = worldMap.getAllEdges();

    for (const island of islands) {
      const islandNode = this.#generateIsland(island, containerSize);
      mapElement.appendChild(islandNode);
    }

    for (const edge of edges) {
      const edgeElement = this.#generateEdge(edge, containerSize);
      mapElement.appendChild(edgeElement);
    }
  }

  renderCloseMap(worldMap) {

  }

  #initDevToolsEvents() {

  }

  renderInitialEntities(player, customers) {

  }


}