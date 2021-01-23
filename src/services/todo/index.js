const todoRepository = require('../../repositories/todo');
const todoService = {
  create: require('./create-todo')({todoRepository}),
  findById: require('./find-todo')({todoRepository}),
  updateById: require('./update-todo')({todoRepository}),
  deleteById: require('./delete-todo')({todoRepository}),
  list: require('./list-todos')({todoRepository})
};
module.exports = todoService;