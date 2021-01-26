afterEach(() => {
  jest.resetModules();
});

it('should return a 201 when todo created', async done => {
  const body = { title: 'post test' };
  jest.mock('../../models/todo', () => jest.fn(() => body));
  const postTodoWrapper = require('./post-todo');
  const todoServiceFake = {
    create: jest.fn(() => body)
  };
  const postTodo = postTodoWrapper({todoService: todoServiceFake});
  const result = await postTodo({ request: { body } });
  expect(todoServiceFake.create).toHaveBeenCalledWith(body);
  expect(result.status).toBe(201);
  expect(result.body).toBe(body);
  done();
});

it('should return a 400 when ValidationError thrown', async done => {
  const body = { title: 'post test' };
  const errorMessage = 'model failed validation';
  const ValidationError = require('../../errors/validation.error');
  const mockModel = jest.fn(() => { throw new ValidationError(errorMessage); });
  jest.mock('../../models/todo', () => mockModel);
  const postTodoWrapper = require('./post-todo');
  const todoServiceFake = {};
  const postTodo = postTodoWrapper({todoService: todoServiceFake});
  const result = await postTodo({ request: { body } });
  expect(result.status).toBe(400);
  expect(result.body).toBe(errorMessage);
  done();
});

it('should throw unhandled errors', async done => {
  const body = { title: 'post test' };
  const errorMessage = 'model failed validation';
  const mockModel = jest.fn(() => { throw new Error(errorMessage); });
  jest.mock('../../models/todo', () => mockModel);
  const postTodoWrapper = require('./post-todo');
  const todoServiceFake = {};
  const postTodo = postTodoWrapper({todoService: todoServiceFake});
  await expect(postTodo({ request: { body } })).rejects.toThrowError(errorMessage);
  done();
});
