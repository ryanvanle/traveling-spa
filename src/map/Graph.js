import NodeGenerator from "./utils/NodeGenerator.js";

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
    const nodeGenerator = new NodeGenerator();
    const nodeList = nodeGenerator.generateNodes();

    for (let node of nodeList) {
      this.addNode(node);
    }

    console.log(this.graphList);


    // generate nodes at random positions (Poisson Disk Sampling)
    // generate VALID edges (Deluanay Triangulation)
    // calculate minimum spanning tree to ensure all nodes are connected and prune edges
    // add back prune edges with set probablity return
    // return map 
  }
}