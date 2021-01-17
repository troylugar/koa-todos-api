const Router = require('koa-router');
const {
  generateRepositoryHandlers,
  attachHandlersToDefaultRoutes
} = require('../../helpers/generate-repository');
const model = require('./model');

const router = new Router({
  prefix: '/todos'
});
const handlers = generateRepositoryHandlers(model);
attachHandlersToDefaultRoutes(router, handlers);

module.exports = router;