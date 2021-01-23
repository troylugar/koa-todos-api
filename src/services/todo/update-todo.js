const NotFoundError = require('../../errors/not-found.error');
const TodoModel = require('../../models/todo');

function updateTodoWrapper({ todoRepository }) {
  return async function updateTodo(id, updates) {
    const todo = await todoRepository.findById(id);
    if (!todo) throw new NotFoundError();
    const updatedTodo = TodoModel({
      ...todo,
      ...updates
    });
    await todoRepository.findByIdAndUpdate(id, updatedTodo);
    return updatedTodo;
  };
}

module.exports = updateTodoWrapper;