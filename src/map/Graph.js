import NodeGenerator from "./utils/NodeGenerator.js";
import Delaunator from "./utils/libraries/Delaunator.js";

// Adjacency List non-directional Graph
export default class Graph {
  constructor() {    
    this.graphList = new Map(); // node key, connection node set value
    this.labelToGraphNode = new Map();
    this.width = 1000;
    this.height = 1000;
  }

  addNode(node) {
    if (this.graphList.has(node)) {
      console.error(`Graph addNode: graph already contains node, ${node}`);
      return;
    }

    this.graphList.set(node, new Set());
    this.labelToGraphNode.set(node.label, node);
  }

  addEdge(startNodeLabel, endNodeLabel) {
    const startNode = this.getNodeFromLabel(startNodeLabel);
    const endNode = this.getNodeFromLabel(endNodeLabel);

    if (!this.graphList.has(startNode) || !this.graphList.has(endNode)) {
      console.error(`Graph addEdge: input nodes are invalid`);
      return;
    }

    this.graphList.get(startNode).add(endNode);
    this.graphList.get(endNode).add(startNode);
  }

  removeNode(targetNodeLabel) {
    const targetNode = this.getNodeFromLabel(targetNodeLabel);

    if (!this.graphList.has(targetNode)) {
      console.error(`Graph removeNode: node is not in graph, ${targetNode}`);
      return;
    }

    let targetNodeConnections = this.graphList.get(targetNode);

    // non-directional graph so must removes the connections to the targetNode
    for (let currentNode of targetNodeConnections) {
      let currentNodeConnections = this.graphList.get(currentNode);
      currentNodeConnections.delete(targetNode);
    }

    // remove the node from the list and all connections from the list from their maps
    this.graphList.delete(targetNode);
    this.labelToGraphNode.delete(targetNode.label);
  }

  removeEdge(startNodeLabel, endNodeLabel) {
    const startNode = this.getNodeFromLabel(startNodeLabel);
    const endNode = this.getNodeFromLabel(endNodeLabel);

    if (!this.graphList.has(startNode) || !this.graphList.has(endNode)) {
      console.error(`Graph addEdge: input nodes are invalid`);
      return;
    }

    this.graphList.get(startNode).delete(endNode);
    this.graphList.get(endNode).delete(startNode);
  }

  printGraph() {
    const nodes = this.graphList.keys();
    for (let currentNode of nodes) {
      let currentConnections = this.graphList.get(currentNode);
      let output = "";

      for (let connectionNode of currentConnections) {
        output += connectionNode.label + " ";
      }

      console.log(`${currentNode.label} -> ${output}`);
    }
  }

  getNodeFromLabel(label) {
    return this.labelToGraphNode.get(label)
  }

  getNodes() {
    return this.graphList.keys();
  }

  /**
   * Generates randomized undirected planar graph, that guarantees the all nodes are connected
   * and a valid distance from each other  
   */
  generateRandomGraph() {
    const nodeGenerator = new NodeGenerator(30, 400, 400, 30);
    const nodeList = nodeGenerator.generateNodes();
    const pointList = [];
    const pointToNode = {};

    const sourceNode = nodeList[0];
    const endNode = nodeList[nodeList.length - 1];

    // add nodes to graph
    for (let node of nodeList) {
      this.addNode(node);
      pointList.push(node.position);
      pointToNode[JSON.stringify(node.position)] = node; // this is so sus lol, TODO: maybe not use json.stringify perhaps
    }

    // generate all possible triangles from Delaunay triangulation
    const triangleCoordinates = this.#generateTriangles(pointList);
  
    // connect the triangle point to each other
    for (let trianglePoints of triangleCoordinates) {
      let coordinateOne = JSON.stringify(trianglePoints[0]);
      let coordinateTwo = JSON.stringify(trianglePoints[1]);
      let coordinateThree = JSON.stringify(trianglePoints[2]);

      let nodeOne = pointToNode[coordinateOne];
      let nodeTwo = pointToNode[coordinateTwo];
      let nodeThree = pointToNode[coordinateThree];

      this.addEdge(nodeOne.label, nodeTwo.label);
      this.addEdge(nodeOne.label, nodeThree.label);
      this.addEdge(nodeThree.label, nodeTwo.label);
    }

    // calculate spanning tree to ensure all nodes are connected and prune edges
    this.#generateSpanningTree(nodeList.length, sourceNode);

    // add back prune edges with set probablity return

    // this.printGraph()
    // return map 
  }

  #generateTriangles(pointList) {
    let formattedPointsInput = [];
    for (let point of pointList) {
      formattedPointsInput.push(point.x);
      formattedPointsInput.push(point.y);
    }

    let delaunator = new Delaunator(formattedPointsInput);
    let triangles = delaunator.triangles;
    let triangleCoordinates = [];

    for (let i = 0; i < triangles.length; i += 3) {
      triangleCoordinates.push([
        {x: formattedPointsInput[2 * triangles[i]],  y: formattedPointsInput[2 * triangles[i] + 1]},
        {x: formattedPointsInput[2 * triangles[i + 1]], y: formattedPointsInput[2 * triangles[i + 1] + 1]},
        {x: formattedPointsInput[2 * triangles[i + 2]], y: formattedPointsInput[2 * triangles[i + 2] + 1]}
      ]);
    }

    return triangleCoordinates;
  }

  #generateSpanningTree(nodeLength, sourceNode) {
    let queue = []; 
  }
}