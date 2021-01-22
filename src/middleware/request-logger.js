const koaPino = require('koa-pino-logger');
const config = require('../utilities/config');

let devOpts = {};

if (config.node_env !== 'production') {
  devOpts = {
    prettyPrint: true
  };
}

// wrapping request logger just so it looks like other middleware
module.exports = () => koaPino(devOpts);