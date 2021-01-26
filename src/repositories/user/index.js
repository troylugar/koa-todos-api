const logger = require('../../utilities/logger');
const schema = require('./user.schema');
const userRepositoryWrapper = require('./user.repository');

const userRepository = userRepositoryWrapper({ schema, logger });
module.exports = userRepository;