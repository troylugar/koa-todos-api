const http = require('http');
const mongoose = require('mongoose');
const config = require('./helpers/config');
const { logger } = require('./middleware/logger');
const app = require('./app');

const server = http.createServer(app.callback());

async function gracefulShutdown(err) {
  // log errors
  if (err) {
    logger.error(err);
  }

  // close mongo connection
  await mongoose.connection.close(false);
  logger.info('Mongo connection has closed.');

  // close server connection
  server.close((serverError) => {
    if (serverError) {
      logger.error(serverError);
    }

    logger.info('Shutting down...');
    process.exit();
  });
}

// start server
server.listen(config.port, '0.0.0.0', () => {
  logger.info(`Server running on port ${config.port}`);

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
  process.on('uncaughtException', gracefulShutdown);
  process.on('unhandledRejection', gracefulShutdown);
});
