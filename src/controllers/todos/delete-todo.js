function deleteTodoWrapper({ todoService }) {
  return async function deleteTodo(request) {
    const { id } = request.params;
    const results = await todoService.deleteById(id);
    return {
      status: results
        ? 204
        : 404
    };
  };
}

module.exports = deleteTodoWrapper;