const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const helmet = require('koa-helmet');
const bodyParser = require('koa-bodyparser');
const requestLogger = require('./middleware/request-logger');
const healthcheck = require('./middleware/health-check');
const generateRouter = require('./utilities/generate-router');
const todoController = require('./controllers/todos');

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
const todoRouter = generateRouter(todoController);
const router = new Router({ prefix: '/api' });
router.use('/todos', todoRouter.routes());
app.use(router.routes());

module.exports = app;
