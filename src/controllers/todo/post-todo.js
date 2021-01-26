const ValidationError = require('../../errors/validation.error');
const TodoModel = require('../../models/todo');

function postTodoWrapper({ todoService }) {
  return async function postTodo({ request }) {
    const data = request.body;
    try {
      const todo = TodoModel(data);
      const results = await todoService.create(todo);
      return {
        body: results,
        status: 201
      };
    } catch (err) {
      if (err instanceof ValidationError) {
        return { body: err.message, status: 400 };
      } else {
        throw err;
      }
    }
  };
}

module.exports = postTodoWrapper;