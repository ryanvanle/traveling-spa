class EventEmitter {
  constructor() {
    this.events = [];
  }

  on(eventName, listener) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
  }

  emit(eventName, payload) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(listener => listener(payload));
    }
  }
}

// exporting an instance not the class
const EventBus = new EventEmitter();
export default EventBus;