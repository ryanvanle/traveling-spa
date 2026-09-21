// Adjacency List non-directional Graph
export default class Graph {
  constructor(numberOfNodes) {
    this.numberOfNodes = numberOfNodes;
    
    this.graphList = new Map(); // node key, connection node set value
    this.labelToGraphNode = new Map();
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

  // Erdos-Renyi Random Graph Generation algo
  generateRandomGraph() {

  }
}