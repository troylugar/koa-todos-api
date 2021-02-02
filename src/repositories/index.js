const todoSchema = require('./todo.schema');
const TodoRepository = require('./todo.repository');
const todoRepository = new TodoRepository(todoSchema);

const userSchema = require('./user.schema');
const UserRepository = require('./user.repository');
const userRepository = new UserRepository(userSchema);

const repositories = {
  todoRepository,
  userRepository
};

module.exports = repositories;
