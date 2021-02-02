const Router = require('@koa/router');
const generateHandler = require('./generate-handler');

function generateRouter(routes) {
  const router = new Router();
  for (let route of routes) {
    const method = route.method.toLowerCase();
    const middleware = (route.middleware || []);
    const handlers  = [...middleware, generateHandler(route.controller)];
    router[method](route.path, ...handlers);
  }
  return router;
}

module.exports = generateRouter;