const logger = require('../../utilities/logger');
const todoService = require('../../services/todo-service');

const getTodosWrapper = require('./get-todos');
const getTodos = getTodosWrapper({ todoService });

const getTodoWrapper = require('./get-todo');
const getTodo = getTodoWrapper({ todoService });

const postTodosWrapper = require('./post-todos');
const postTodos = postTodosWrapper({ todoService, logger });

const patchTodoWrapper = require('./patch-todo');
const patchTodo = patchTodoWrapper({ todoService, logger });

const deleteTodoWrapper = require('./delete-todo');
const deleteTodo = deleteTodoWrapper({ todoService, logger });

module.exports = [
  { method: 'GET', path: '/', controller: getTodos },
  { method: 'GET', path: '/:id', controller: getTodo },
  { method: 'POST', path: '/', controller: postTodos },
  { method: 'PATCH', path: '/:id', controller: patchTodo },
  { method: 'DELETE', path: '/:id', controller: deleteTodo }
];