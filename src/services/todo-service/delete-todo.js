function deleteTodoWrapper({ todoRepository }) {
  return async function deleteTodo(id) {
    return await todoRepository.findByIdAndDelete(id);
  };
}

module.exports = deleteTodoWrapper;