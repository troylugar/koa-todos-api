const todoService = require('../../services/todo');

const getTodosWrapper = require('./get-todos');
const getTodos = getTodosWrapper({ todoService });

const getTodoWrapper = require('./get-todo');
const getTodo = getTodoWrapper({ todoService });

const postTodoWrapper = require('./post-todo');
const postTodo = postTodoWrapper({ todoService });

const patchTodoWrapper = require('./patch-todo');
const patchTodo = patchTodoWrapper({ todoService });

const deleteTodoWrapper = require('./delete-todo');
const deleteTodo = deleteTodoWrapper({ todoService });

const todoController = [
  { method: 'GET', path: '/', controller: getTodos },
  { method: 'GET', path: '/:id', controller: getTodo },
  { method: 'POST', path: '/', controller: postTodo },
  { method: 'PATCH', path: '/:id', controller: patchTodo },
  { method: 'DELETE', path: '/:id', controller: deleteTodo }
];

module.exports = todoController;