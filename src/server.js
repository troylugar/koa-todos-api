const http = require('http');
const mongoose = require('mongoose');
const config = require('./utilities/config');
const logger = require('./utilities/logger');
const app = require('./app');

mongoose.connect(config.mongo_uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
const db = mongoose.connection;
db.on('error', error => {
  logger.error(error);
});
db.once('connected', () => {
  logger.info('Mongo connected');
  app.emit('ready');
});
db.on('reconnected', () => {
  logger.info('Mongo re-connected');
});
db.on('disconnected', () => {
  logger.info('Mongo disconnected');
});

const server = http.createServer(app.callback());

async function gracefulShutdown(err) {
  if (err) {
    logger.error(err);
  }

  await mongoose.connection.close(false);
  logger.info('Mongo connection has closed.');

  server.close((serverError) => {
    if (serverError) {
      logger.error(serverError);
    }

    logger.info('Shutting down...');
    process.exit();
  });
}

server.listen(config.port, '0.0.0.0', () => {
  logger.info(`Server running on port ${config.port}`);

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
  process.on('uncaughtException', gracefulShutdown);
  process.on('unhandledRejection', gracefulShutdown);
});

module.exports = server;