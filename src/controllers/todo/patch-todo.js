const { todoService } = require('../../services');
const NotFoundError = require('../../errors/not-found.error');
const ValidationError = require('../../errors/validation.error');

async function patchTodos({ request, params }) {
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
    } else if (err instanceof ValidationError) {
      return { body: err.message, status: 400 };
    } else {
      throw err;
    }
  }
}

module.exports = patchTodos;