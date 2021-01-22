const pino = require('pino');
const config = require('./config');

let devOpts = {};

if (config.node_env !== 'production') {
  devOpts = {
    prettyPrint: true
  };
}

module.exports = pino(devOpts);