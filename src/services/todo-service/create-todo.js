function saveTodoWrapper({ todoRepository }) {
  return async function saveTodo(data) {
    return await todoRepository.insert(data);
  };
}

module.exports = saveTodoWrapper;