const { todoService } = require('../../services');
const ValidationError = require('../../errors/validation.error');
const TodoModel = require('../../models/todo');

async function postTodo({ request }) {
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
      return { body: err, status: 400 };
    } else {
      throw err;
    }
  }
}

module.exports = postTodo;