import EventBus from "../EventEmitter.js";

const CONTAINER_TAG = "world-map-area";
const CONTENT_TAG = "world-map-content";
const W3_SVG_URL = "http://www.w3.org/2000/svg";

export default class DOMMapRenderer {
  constructor() {
    this.root = document.getElementById(CONTAINER_TAG);
    this.container = null;
    this.worldMap = null;

    this.islandLabelToElement = new Map();
    this.edgeLabelToElement = new Map();
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
    this.worldMap = worldMap;

    const worldMapContainer = document.createElement("dialog");
    worldMapContainer.id = "map";

    const mapElementsContainer = document.createElement("div");
    mapElementsContainer.id = CONTENT_TAG;

    this.root.appendChild(worldMapContainer);
    worldMapContainer.append(mapElementsContainer);
    this.container = worldMapContainer;
  }

  #generateIsland(islandData, worldSize, containerSize) {
    const islandElement = document.createElementNS(W3_SVG_URL, "circle");

    islandElement.setAttribute("cx", islandData.position.x);
    islandElement.setAttribute("cy", islandData.position.y);
    islandElement.classList.add("island-default");

    islandElement.addEventListener("mouseover", () => {
      this.drawLinesFromIsland(islandData, islandElement);
    });

    return islandElement;
  }

  drawLinesFromIsland(islandData, islandElement) {
    const islandEdges = this.worldMap.getEdges(islandData);
    for (const islandDestination of islandEdges) {
      const edgeElement = this.#getEdgeElement(islandData, islandDestination);
      edgeElement.classList.remove(...edgeElement.classList); // removes all classes
      edgeElement.classList.add("edge-active");
    }
  }

  #getEdgeElement(islandSource, islandDestination) {
    // the graph is non-directional but not the labels
    // so you have to check both ways to actually check if there's a key.
    const edgeKeyOne = this.#generateEdgeLabel(islandSource, islandDestination);
    const edgeKeyTwo = this.#generateEdgeLabel(islandDestination, islandSource);
    const isValidKey = this.edgeLabelToElement.has(edgeKeyOne);

    return isValidKey
      ? this.edgeLabelToElement.get(edgeKeyOne)
      : this.edgeLabelToElement.get(edgeKeyTwo);
  }

  #generateEdge(edge) {
    const islandPositionOne = edge.source.position;
    const islandPositionTwo = edge.destination.position;
    const line = this.#generateLine(islandPositionOne, islandPositionTwo);
    return line;
  }

  #generateLine(positionOne, positionTwo) {
    const line = document.createElementNS(W3_SVG_URL, "line");
    line.setAttribute("x1", positionOne.x);
    line.setAttribute("y1", positionOne.y);
    line.setAttribute("x2", positionTwo.x);
    line.setAttribute("y2", positionTwo.y);
    line.classList.add("edge-default");
    return line;
  }

  renderOpenMap(worldMap) {
    console.log("renderOpenMap", worldMap);

    const mapElement = document.getElementById(CONTENT_TAG);
    mapElement.innerHTML = "";

    const containerSize = {
      width: mapElement.offsetWidth,
      height: mapElement.offsetHeight,
    };

    const svgContainer = document.createElementNS(W3_SVG_URL, "svg");
    svgContainer.id = "world-map-draw-space";
    mapElement.appendChild(svgContainer);
    svgContainer.setAttribute("width", containerSize.width);
    svgContainer.setAttribute("height", containerSize.height);

    const islands = worldMap.getIslands();
    const edges = worldMap.getAllEdges();

    for (const edge of edges) {
      const edgeElement = this.#generateEdge(edge, containerSize);
      svgContainer.appendChild(edgeElement);

      const edgeLabel = this.#generateEdgeLabel(edge.source, edge.destination);
      this.edgeLabelToElement.set(edgeLabel, edgeElement);
    }

    for (const island of islands) {
      const islandElement = this.#generateIsland(island, containerSize);
      svgContainer.appendChild(islandElement);
      this.islandLabelToElement.set(island.label, islandElement);
    }
  }

  #generateEdgeLabel(islandSource, islandDestination) {
    if (islandSource == null || islandDestination == null) {
      console.log("one is null", islandSource, islandDestination);
    }
    return `edge-${islandSource.label}-${islandDestination.label}`;
  }

  renderCloseMap(worldMap) {}

  #initDevToolsEvents() {}

  renderInitialEntities(player, customers) {}
}
