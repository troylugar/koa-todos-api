const Koa = require('koa');
const mongoose = require('mongoose');
const cors = require('koa2-cors');
const helmet = require('koa-helmet');
const bodyParser = require('koa-bodyparser');
const config = require('./helpers/config');
const { logger, requestLogger } = require('./middleware/logger');
const healthcheck = require('./middleware/health-check');
const api = require('./api/index');

// setup db
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

// setup app
const app = new Koa();
app.use(requestLogger());
app.use(bodyParser());
app.use(helmet());
app.use(cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowHeaders: ['Content-Type', 'Accept']
}));
app.use(healthcheck());

// setup routes
app.use(api.routes());

module.exports = app;
