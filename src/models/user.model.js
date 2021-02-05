const uuid = require('../utilities/generate-uuid');
const now = require('../utilities/generate-date');
const {
  isString,
  hasMinLength,
  validate,
  validateMultiple
} = require('../validators');

class User {
  constructor({
    id = uuid(),
    username,
    password,
    roles = [],
    createdAt = now(),
    updatedAt = now()
  } = {}) {
    validateMultiple(
      validate(username, isString, 'username must be a string'),
      validate(username, hasMinLength(3), 'username must have length >= 3')
    );

    this.id = id;
    this.username = username;
    this.password = password;
    this.roles = roles;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = User;