const { todoService } = require('../../services');
const NotFoundError = require('../../errors/not-found.error');

async function deleteTodo(request) {
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
}

module.exports = deleteTodo;