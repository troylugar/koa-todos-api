const uuid = require('../../utilities/generate-uuid');
const now = require('../../utilities/generate-date');
const validators = require('../../validators');

const { isString, hasMinLength, validate, validateMultiple } = validators;

class Todo {
  constructor({
    id = uuid(),
    title,
    completed = false,
    createdAt = now(),
    updatedAt = now()
  } = {}) {
    validateMultiple(
      validate(title, isString, 'title must be a string'),
      validate(title, hasMinLength(3), 'title must have a length >= 3'),
    );

    this.id = id;
    this.title = title;
    this.completed = completed;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}

module.exports = Todo;
