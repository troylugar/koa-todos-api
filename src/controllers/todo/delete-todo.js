const NotFoundError = require('../../errors/not-found.error');

function deleteTodoWrapper({ todoService }) {
  return async function deleteTodo(request) {
    const { id } = request.params;
    try {
      await todoService.deleteById(id);
      return { status: 204 };
    } catch (err) {
      if (err instanceof NotFoundError) {
        return { status: 404 };
      } else {
        throw err;
      }
    }
  };
}

module.exports = deleteTodoWrapper;