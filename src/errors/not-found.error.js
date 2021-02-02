function NotFoundError (message) {
  Error.call(this, message);
  Error.captureStackTrace(this);
  this.name = this.constructor.name;
  this.message = message;
}

NotFoundError.prototype = Object.create(Error.prototype);
NotFoundError.prototype.constructor = NotFoundError;

module.exports = NotFoundError;
