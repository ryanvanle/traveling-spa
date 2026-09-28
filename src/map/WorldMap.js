import Graph from "./Graph.js"

export default class WorldMap {
  constructor() {
    this.graph = new Graph(1046, 1374, 30);
    this.graph.generateRandomGraph();
  }

  getIslands() {
    return this.graph.getNodes();
  }

  getAllEdges() {
    return this.graph.getAllEdges();
  }
 }