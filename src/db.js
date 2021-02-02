const mongoose = require('mongoose');
const logger = require('./utilities/logger');
const config = require('./utilities/config');

mongoose.connect(config.mongoUri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

// setup db
const db = mongoose.connection;
db.on('error', error => {
  logger.error(error);
});
db.once('connected', () => {
  logger.info('Database connected');
});
db.on('reconnected', () => {
  logger.info('Database re-connected');
});
db.on('disconnected', () => {
  logger.info('Database disconnected');
});

module.exports = db;
