const { todoService } = require('../../services');
const NotFoundError = require('../../errors/not-found.error');

async function getTodo(request) {
  const { id } = request.params;
  try {
    const results = await todoService.findById(id);
    return {
      body: results,
      status: 200
    };
  } catch (err) {
    if (err instanceof NotFoundError) {
      return { status: 404 };
    } else {
      throw err;
    }
  }
}

module.exports = getTodo;