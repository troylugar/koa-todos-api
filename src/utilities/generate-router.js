const Router = require('@koa/router');
const generateHandler = require('./generate-handler');

function generateRouter(routes) {
  const router = new Router();
  for (let route of routes) {
    const method = route.method.toLowerCase();
    const handler = generateHandler(route.controller);
    router[method](route.path, handler);
  }
  return router;
}

module.exports = generateRouter;