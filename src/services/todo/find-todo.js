function findTodoByIdWrapper({ todoRepository }) {
  return async function findTodoById(id) {
    return await todoRepository.findById(id);
  };
}

module.exports = findTodoByIdWrapper;