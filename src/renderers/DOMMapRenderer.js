import EventBus from "../EventEmitter.js";

const CONTAINER_TAG = "world-map-area";
const CONTENT_TAG = "world-map-content";
const W3_SVG_URL = "http://www.w3.org/2000/svg";

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
    const islandElement = document.createElementNS(W3_SVG_URL, "circle");

    const ISLAND_ATTRIBUTES = {
      radius: 10,
      fill: "red",
      stroke: "green",
      strokeWidth: 3,
    };

    islandElement.setAttribute("cx", island.position.x);
    islandElement.setAttribute("cy", island.position.y);
    islandElement.setAttribute("r", ISLAND_ATTRIBUTES.radius);
    islandElement.setAttribute("fill", ISLAND_ATTRIBUTES.fill);
    islandElement.setAttribute("stroke", ISLAND_ATTRIBUTES.stroke);
    islandElement.setAttribute("stroke-width", ISLAND_ATTRIBUTES.strokeWidth);

    return islandElement;
  }

  #generateEdge(edge) {
    const islandPositionOne = edge.source.position;
    const islandPositionTwo = edge.destination.position;
    const line = this.#generateLine(islandPositionOne, islandPositionTwo);
    return line;
  }

  #generateLine(positionOne, positionTwo) {
    const line = document.createElementNS(W3_SVG_URL, "line");
    const LINE_ATTRIBUTES = {
      color: "purple",
      strokeWidth: 5,
    };

    line.setAttribute("x1", positionOne.x);
    line.setAttribute("y1", positionOne.y);
    line.setAttribute("x2", positionTwo.x);
    line.setAttribute("y2", positionTwo.y);
    line.setAttribute("stroke", LINE_ATTRIBUTES.color);
    line.setAttribute("stroke-width", LINE_ATTRIBUTES.strokeWidth);

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
    }

    for (const island of islands) {
      const islandNode = this.#generateIsland(island, containerSize);
      svgContainer.appendChild(islandNode);
    }
  }

  renderCloseMap(worldMap) {}

  #initDevToolsEvents() {}

  renderInitialEntities(player, customers) {}
}
