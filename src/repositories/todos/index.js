const logger = require('../../utilities/logger');
const schema = require('./todo.schema');
const todoRepositoryWrapper = require('./todo.repository');

const todoRepository = todoRepositoryWrapper({ schema, logger });
module.exports = todoRepository;