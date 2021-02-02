const { todoService } = require('../../services');

async function getTodos() {
  const results = await todoService.list();
  return {
    body: results,
    status: 200
  };
}

module.exports = getTodos;