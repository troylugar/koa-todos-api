const auth = require('../../middleware/authorize');

const todoController = [
  { method: 'GET', path: '/', controller: require('./get-todos') },
  { method: 'GET', path: '/:id', controller: require('./get-todo') },
  { method: 'POST', path: '/', middleware: [auth], controller: require('./post-todo') },
  { method: 'PATCH', path: '/:id', middleware: [auth], controller: require('./patch-todo') },
  { method: 'DELETE', path: '/:id', middleware: [auth], controller: require('./delete-todo') }
];

module.exports = todoController;
