const Router = require('koa-router');
const generateRouter = require('./utilities/generate-router');
const todoController = require('./controllers/todo');

const todoRouter = generateRouter(todoController);
const router = new Router({ prefix: '/api' });
router.use('/todos', todoRouter.routes());

module.exports = router;
