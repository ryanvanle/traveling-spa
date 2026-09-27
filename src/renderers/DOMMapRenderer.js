import EventBus from "../EventEmitter.js";

const CONTAINER_TAG = "#world-map-area";
export default class DOMMapRenderer {
  constructor() {
    this.root = document.querySelector(CONTAINER_TAG);
    this.container = null;
    this.entityElements = new Map();
    this.#setupListeners();
  }

  #setupListeners() {
    EventBus.on("worldMap:open", (worldMap) => this.renderOpenMap(worldMap));
    EventBus.on("worldMap:close", (worldMap) => this.renderCloseMap(worldMap));
  }

  init(worldMap) {

    console.log("HELLOO", worldMap);
    this.initWorldMap(worldMap);
    // this.setupEvents();
    // this.renderInitialMap()
  }

  setupEvents() {
    if (!this.container) {
      console.warn("DOMMapRenderer setupEvents, this.container is null");
    }

    // this.container.addEventListener("click", (event) => {
      // const targetPosition = this.getCoordsFromXY(event.clientX, event.clientY);
      // EventBus.emit("input:grid-clicked", targetPosition);
    // });

    // this.#initDevToolsEvents();
  }

  initWorldMap(worldMap) {

    let worldMapContainer = document.createElement("div");
    worldMapContainer.id = "map";

    const islands = worldMap.getIslands();
    const edges = worldMap.getAllEdges();

    this.root.appendChild(worldMapContainer);
    this.container = worldMapContainer;
  }

  renderOpenMap(worldMap) {

  }

  renderCloseMap(worldMap) {

  }

  #initDevToolsEvents() {

  }

  renderInitialEntities(player, customers) {

  }


}