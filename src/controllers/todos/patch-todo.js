const TodoModel = require('../../models/todo');

function patchTodosWrapper({ todoService, logger }) {
  return async function patchTodos({ request }) {
    const { id } = request.params;
    const data = request.body;
    try {
      const oldTodo = await todoService.findById(id);
      
      if (oldTodo) {
        const updatedTodo = TodoModel({
          ...oldTodo,
          ...data
        });
        todoService.updateById(id, updatedTodo);
        return {
          body: updatedTodo,
          status: 200
        };
      } else {
        return {
          status: 404
        };
      }
    } catch (error) {
      logger.error(error);
    }
  };
}

module.exports = patchTodosWrapper;