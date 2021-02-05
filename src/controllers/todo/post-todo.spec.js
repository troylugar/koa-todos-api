const { Todo } = require('../../models');
const { todoService } = require('../../services');
const postTodo = require('./post-todo');
const ValidationError = require('../../errors/validation.error');

jest.mock('../../models');
jest.mock('../../services');

afterEach(() => {
  jest.resetAllMocks();
});

it('should return a 201 when todo created', async done => {
  const body = { title: 'post test' };
  Todo.mockImplementation(() => body);
  todoService.create.mockImplementation(() => body);
  const result = await postTodo({ request: { body } });
  expect(todoService.create).toHaveBeenCalledWith(body);
  expect(result.status).toBe(201);
  expect(result.body).toBe(body);
  done();
});

it('should return a 400 when ValidationError thrown', async done => {
  const body = { title: 'post test' };
  const error = new ValidationError('model failed validation');
  Todo.mockImplementation(() => { throw error; });
  const result = await postTodo({ request: { body } });
  expect(result.status).toBe(400);
  expect(result.body).toBe(error);
  done();
});

it('should throw unhandled errors', async done => {
  const body = { title: 'post test' };
  const errorMessage = 'model failed validation';
  Todo.mockImplementation(() => { throw new Error(errorMessage); });
  await expect(postTodo({ request: { body } })).rejects.toThrowError(errorMessage);
  done();
});
