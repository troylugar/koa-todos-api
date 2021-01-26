const Router = require('koa-router');
const generateRouter = require('./utilities/generate-router');
const todoController = require('./controllers/todo');
const userController = require('./controllers/user');

const todoRouter = generateRouter(todoController);
const userRouter = generateRouter(userController);
const router = new Router({ prefix: '/api' });
router.use('/todos', todoRouter.routes());
router.use('/users', userRouter.routes());

module.exports = router;
