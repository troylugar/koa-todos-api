function getTodosWrapper({ todoService }) {
  return async function getTodos() {
    const results = await todoService.list();
    return {
      body: results,
      status: 200
    };
  };
}

module.exports = getTodosWrapper;