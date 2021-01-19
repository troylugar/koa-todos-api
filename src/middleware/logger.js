const koaPino = require('koa-pino-logger');
const pino = require('pino');
const config = require('../helpers/config');

let devOpts = {};

if (config.NODE_ENV !== 'production') {
  devOpts = {
    prettyPrint: true
  };
}

// wrapping request logger just so it looks like other middleware
module.exports.requestLogger = () => koaPino(devOpts);
module.exports.logger = pino(devOpts);