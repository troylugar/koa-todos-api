function AuthenticationError (message) {
  Error.call(this, message);
  Error.captureStackTrace(this);
  this.name = this.constructor.name;
  this.message = message;
}

AuthenticationError.prototype = Object.create(Error.prototype);
AuthenticationError.prototype.constructor = AuthenticationError;

module.exports = AuthenticationError;
