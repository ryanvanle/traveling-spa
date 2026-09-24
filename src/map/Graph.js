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

  containsNodeFromLabel(label) {
    return this.graphList.has(this.getNodeFromLabel(label));
  }

  getNodeFromLabel(label) {
    return this.labelToGraphNode.get(label)
  }

  getNodes() {
    return Array.from(this.graphList.keys());
  }

  getEdgesFromLabel(label) {
    const node = this.getNodeFromLabel(label);
    return this.graphList.get(node);
  }

  getEdges(node) {
    return this.graphList.get(node);
  }

  getAllEdges() {
    const edges = []; // {source: node, destination: node}
    const seenEdges = new Set();

    for (const [currentSourceNode, currentEdgeSet] of this.graphList.entries()) {
      for (const destinationNode of currentEdgeSet) {

        // undirected so we just need one way
        const edgeKey = currentSourceNode.id < destinationNode.id
          ? `${currentSourceNode.id}-${destinationNode.id}`
          : `${destinationNode.id}-${currentSourceNode.id}`;

          if (!seenEdges.has(edgeKey)) {
            seenEdges.add(edgeKey);
            edges.push({
              source: currentSourceNode,
              destination: destinationNode
            });
          }
      }
    }

    return edges;
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
    const allPossibleRemovedEdges = this.#generateSpanningTree();
    console.log(allPossibleRemovedEdges.length, this.getAllEdges().length);

    console.log("before");
    this.printGraph();
    console.log("before");

    const PROBABILITY_TO_REMOVE = 100;
    for (const currentEdge of allPossibleRemovedEdges) {
      if (this.#generateChance(PROBABILITY_TO_REMOVE)) {
        this.removeEdge(currentEdge.source.label, currentEdge.destination.label);
      }
    }

    console.log("after");
    this.printGraph();
    console.log("after");
  }


  /**
   * returns true or false based on the given percentage chance
   * @param {number} percentage - percent change of returning true (0 - 100);
   * @returns {boolean}
   */
  #generateChance(percentage = 50) {
    if (percentage < 0 || percentage > 100) {
      console.error("#generateChance: invalid percentage", percentage);
    }

    const threshold = percentage / 100;
    return Math.random() < threshold;
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


  /**
   * Kruskal Algorithm for unweighted spanning tree.
   * @returns removedEdges array [{source: Node, destination: Node}, ...];
   */
  #generateSpanningTree() {
    const nodes = this.getNodes();
    const numberOfNodes = nodes.length;

    // mapping for DisjointSet
    const nodeToIndex = new Map();
    nodes.forEach((node, index) => nodeToIndex.set(node, index));

    // get edges
    const edges = this.getAllEdges();

    // "sort" the edges, they all have the same weight
    this.#shuffleArray(edges);

    const dsu = new DisjointSet(numberOfNodes);
    const removedEdges = [];
    let edgesAddedCount = 0;

    for (let i = 0; i < edges.length; i++) {
      const currentEdge = edges[i];
      if (edgesAddedCount === numberOfNodes - 1) {
        removedEdges.push(...edges.slice(i));
        break;
      }

      const sourceIndex = nodeToIndex.get(currentEdge.source);
      const destinationIndex = nodeToIndex.get(currentEdge.destination);
      if (dsu.union(sourceIndex, destinationIndex)) {
        edgesAddedCount++;
      } else {
        removedEdges.push(currentEdge);
      }
    }

    console.log(removedEdges, "HEREEE HE HEREE HE")
    return removedEdges;
  }

  /**
   * in-place Fisher–Yates (aka Knuth) Shuffle.
   * @param {any} array
   */
  #shuffleArray(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  }
}

class DisjointSet {
  constructor(size) {
    this.parent = Array.from({length: size}, (_, i) => i);
    this.rank = new Array(size).fill(0);
  }

  find(i) {
    if (this.parent[i] === undefined) {
      return null;
    }

    if (this.parent[i] === i) {
      return i;
    }

    this.parent[i] = this.find(this.parent[i]);
    return this.parent[i];
  }

  union(i, j) {
    const rootI = this.find(i);
    const rootJ = this.find(j);

    if (rootI === rootJ)
      return false;

    if (this.rank[rootI] < this.rank[rootJ]) {
      this.parent[rootI] = rootJ;
    } else if (this.rank[rootI] > this.rank[rootJ]) {
      this.parent[rootJ] = rootI;
    } else {
      this.parent[rootJ] = rootI;
      this.rank[rootI]++;
    }

    return true;
  }
}