const TodoWrapper = require('./todo.model');
const validators = require('../../validators');
const uuid = require('../../utilities/generate-uuid');
const now = require('../../utilities/generate-date');

const TodoModel = TodoWrapper({
  uuid,
  now,
  validators
});

module.exports = TodoModel;