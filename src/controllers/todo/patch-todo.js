const NotFoundError = require('../../errors/not-found.error');

function patchTodoWrapper({ todoService }) {
  return async function patchTodos({ request, params }) {
    const { id } = params;
    const data = request.body;
    try {
      const updated = await todoService.updateById(id, data);
      return {
        body: updated,
        status: 200
      };
    } catch (err) {
      if (err instanceof NotFoundError) {
        return { status: 404 };
      } else {
        throw err;
      }
    }
  };
}

module.exports = patchTodoWrapper;