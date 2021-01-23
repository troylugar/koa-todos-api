const NotFoundError = require('../../errors/not-found.error');

function findTodoByIdWrapper({ todoRepository }) {
  return async function findTodoById(id) {
    const result = await todoRepository.findById(id);
    if (!result) throw new NotFoundError();
    return result;
  };
}

module.exports = findTodoByIdWrapper;