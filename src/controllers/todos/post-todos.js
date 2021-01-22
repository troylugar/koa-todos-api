const TodoModel = require('../../models/todo');

function postTodosWrapper({ todoService, logger }) {
  return async function postTodos({ request }) {
    const data = request.body;
    try {
      const todo = TodoModel(data);
      const results = await todoService.create(todo);
      logger.info(results, 'Successfuly saved todo');
      return {
        body: results,
        status: 200
      };
    } catch (error) {
      logger.error(error);
    }
  };
}

module.exports = postTodosWrapper;