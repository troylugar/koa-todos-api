function listTodosWrapper({ todoRepository }) {
  return async function listTodos() {
    return await todoRepository.find();
  };
}

module.exports = listTodosWrapper;