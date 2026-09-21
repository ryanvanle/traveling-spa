const NODE_TYPES = ["gameplay", "shop", "event"];

export default class Node {
  constructor(label) {
    this.label = label;
    this.id = crypto.randomUUID();
    this.type = "placeholder";
    this.isStartNode = false;
    this.isEndNode = false;
    this.isPlayerPresent = false;
  }
}