const Router = require('koa-router');
const {
  generateRepositoryHandlers,
  registerHandlersToDefaultRoutes
} = require('../../helpers/generate-repository');
const model = require('./model');

const router = new Router({
  prefix: '/todos'
});
const handlers = generateRepositoryHandlers(model);
registerHandlersToDefaultRoutes(router, handlers);

module.exports = router;