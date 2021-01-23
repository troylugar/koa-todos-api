const NotFoundError = require('../../errors/not-found.error');

function deleteTodoWrapper({ todoRepository }) {
  return async function deleteTodo(id) {
    const result = await todoRepository.findByIdAndDelete(id);
    if (!result) throw new NotFoundError();
  };
}

module.exports = deleteTodoWrapper;