class Event {
  constructor() {
    this.listeners = [];
  }
  trigger(params) {
    this.listeners.forEach((l) => l(params));
  }
  addListener(l) {
    this.listeners.push(l);
  }
  removeListener(l) {
    this.listeners = this.listeners.filter((x) => x !== l);
  }
}

export default Event;