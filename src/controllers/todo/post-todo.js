const TodoModel = require('../../models/todo');

function postTodoWrapper({ todoService }) {
  return async function postTodo({ request }) {
    const data = request.body;
    const todo = TodoModel(data);
    const results = await todoService.create(todo);
    return {
      body: results,
      status: 201
    };
  };
}

module.exports = postTodoWrapper;