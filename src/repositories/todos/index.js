const logger = require('../../utilities/logger');
const schema = require('./todos.schema');
const todosDbWrapper = require('./todos.repository');

const todosDb = todosDbWrapper({ schema, logger });
module.exports = todosDb;