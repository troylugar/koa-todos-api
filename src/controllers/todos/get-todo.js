function getTodoWrapper({ todoService }) {
  return async function getTodo(request) {
    const { id } = request.params;
    const results = await todoService.findById(id);
    return results
      ? {
        body: results,
        status: 200
      }
      : {
        status: 404
      };
  };
}

module.exports = getTodoWrapper;