function updateTodoWrapper({ todoRepository }) {
  return async function updateTodo(id, updatedTodo) {
    return await todoRepository.findByIdAndUpdate(id, updatedTodo);
  };
}

module.exports = updateTodoWrapper;