function ValidationError (message) {
  Error.call(this, message);
  Error.captureStackTrace(this);
  this.name = this.constructor.name;
  this.message = message;
}

ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.constructor = ValidationError;

module.exports = ValidationError;
