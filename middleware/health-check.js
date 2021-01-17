const Router = require('koa-router');
const { connection } = require('mongoose');

function getMongoStatus() {
  return connection.readyState === 1
    ? 'up'
    : 'down';
}

const router = new Router();
router.get('/health-check', async (ctx) => {
  ctx.status = 200;
  ctx.body = {
    status: 'up',
    timestamp: new Date(),
    mongo: {
      status: getMongoStatus()
    }
  };
});

module.exports = router.routes.bind(router);
