const mongoose = require('mongoose');
const TodoWrapper = require('./todo.model');
const validators = require('../../validators');

const uuid = () => mongoose.Types.ObjectId();
const now = () => Date.now();
const TodoModel = TodoWrapper({
  uuid,
  now,
  validators
});

module.exports = TodoModel;