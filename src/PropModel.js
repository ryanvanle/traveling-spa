export default class PropModel {
  constructor(type) {
    this.id = crypto.randomUUID();
    this.type = type;
  }
}