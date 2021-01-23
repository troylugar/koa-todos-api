const Koa = require('koa');
const cors = require('koa2-cors');
const helmet = require('koa-helmet');
const bodyParser = require('koa-bodyparser');
const requestLogger = require('./middleware/request-logger');
const healthcheck = require('./middleware/health-check');
const routes = require('./routes');

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
app.use(routes.routes());

module.exports = app;
