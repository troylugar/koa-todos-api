const bcrypt = require('bcrypt');
const config = require('./config');
const logger = require('./logger');
const StopWatch = require('./stopwatch');

async function hashPassword(password) {
  const sw = new StopWatch('hashPassword');
  sw.start();
  const hash = await bcrypt.hash(password, config.saltRounds);
  sw.stop();
  logger.info(sw.elapsedTimeMS);
  return hash;
}

module.exports = hashPassword;
