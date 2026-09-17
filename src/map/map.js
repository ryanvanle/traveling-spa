// Adjacency List Representation of a Map
class Map {
  constructor() {

  }
}

// Adjacency List non-directional Graph
class Graph {
  constructor(numberOfNodes) {
    this.numberOfNodes = numberOfNodes;
    this.graphList = new Map();
  }

  addNode(node) {
    if (this.graphList.has(node)) {
      console.error(`Graph addNode: graph already contains node, ${node}`);
      return;
    }

    this.graphList.set(node, new Set());
  }

  addEdge(startNode, endNode) {
    if (!this.graphList.has(node) || !this.graphList.has(endNode)) {
      console.error(`Graph addEdge: input nodes are invalid`);
      return;
    }

    this.graphList.get(startNode).push(endNode);
    this.graphList.get(endNode).push(startNode);
  }

  removeNode(targetNode) {
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
  }

  removeEdge(startNode, endNode) {

  }

  printGraph() {
    const nodes = this.graphList.keys();
    for (let currentNode of nodes) {
      let currentConnections = this.graphList.get(currentNode);
      let output = "";

      for (let connection of currentConnections) {
        output += connection + " ";
      }

      console.log(`${currentNode} -> ${output}`);
    }
  }
}
