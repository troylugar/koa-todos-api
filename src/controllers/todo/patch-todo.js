const TodoModel = require('../../models/todo');

function patchTodoWrapper({ todoService }) {
  return async function patchTodos(request) {
    const { id } = request.params;
    const data = request.body;
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
  };
}

module.exports = patchTodoWrapper;