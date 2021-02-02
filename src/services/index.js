const { todoRepository, userRepository } = require('../repositories');
const TodoService = require('./todo.service');
const UserService = require('./user.service');

const todoService = new TodoService(todoRepository);
const userService = new UserService(userRepository);

const services = {
  todoService,
  userService
};

module.exports = services;