const http = require('http');
const config = require('./utilities/config');
const logger = require('./utilities/logger');
const app = require('./app');
const db = require('./db');

const server = http.createServer(app.callback());

async function gracefulShutdown(err) {
  if (err) {
    logger.error(err);
  }

  await db.close(false);
  logger.info('Database connection has closed.');

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