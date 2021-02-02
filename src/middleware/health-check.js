const Router = require('@koa/router');
const db = require('../db');

function getDbStatus() {
  return db.readyState === 1
    ? 'up'
    : 'down';
}

const router = new Router();
router.get('/health-check', async ctx => {
  ctx.status = 200;
  ctx.body = {
    status: 'up',
    timestamp: new Date(),
    db: {
      status: getDbStatus()
    }
  };
});

module.exports = router.routes.bind(router);
