const NODE_TYPES = ["gameplay", "shop", "event"];

export default class Node {
  constructor(label, position) {
    this.label = label;
    this.id = crypto.randomUUID();
    this.type = "placeholder";

    this.isStartNode = false;
    this.isEndNode = false;
    this.isPlayerPresent = false;

    this.position = {
      "x": position.x,
      "y": position.y,
    }
  }
  
  equals(targetNode) {
    return this.node.position.x == targetNode.position.x &&
           this.node.position.y == targetNode.position.y;
  }
}