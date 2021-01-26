class StopWatch {
  constructor(name) {
    this.startTime = 0;
    this.stopTime = 0;
    this.name = name;
  }

  get elapsedTimeMS() {
    const elapsed = (this.stopTime || Date.now()) - this.startTime;
    return `[${this.name}] ${elapsed} ms`;
  }

  start() {
    this.startTime = Date.now();
  }

  stop() {
    this.stopTime = Date.now();
  }
}

module.exports = StopWatch;