const Router = require('koa-router');
const todos = require('./todos/routes');

const api = new Router({
  prefix: '/api'
});

api.use(todos.routes());

module.exports = api;
