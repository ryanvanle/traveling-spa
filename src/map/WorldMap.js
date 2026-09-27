import Graph from "./Graph.js"

export default class WorldMap {
  constructor() {
    this.graph = new Graph();
    this.graph.generateRandomGraph();    
  }

  getIslands() {
    return this.graph.getNodes(); 
  }

  getEdges() {
    return this.graph.getEdges();
  }
 }