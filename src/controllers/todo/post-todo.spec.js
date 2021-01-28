const TodoModel = require('../../models/todo');
const todoService = require('../../services/todo');
const postTodoWrapper = require('./post-todo');
const ValidationError = require('../../errors/validation.error');

jest.mock('../../models/todo');
jest.mock('../../services/todo');

const postTodo = postTodoWrapper({ todoService });

afterEach(() => {
  jest.resetAllMocks();
});

it('should return a 201 when todo created', async done => {
  const body = { title: 'post test' };
  TodoModel.mockImplementation(() => body);
  todoService.create.mockImplementation(() => body);
  const result = await postTodo({ request: { body } });
  expect(todoService.create).toHaveBeenCalledWith(body);
  expect(result.status).toBe(201);
  expect(result.body).toBe(body);
  done();
});

it('should return a 400 when ValidationError thrown', async done => {
  const body = { title: 'post test' };
  const errorMessage = 'model failed validation';
  TodoModel.mockImplementation(() => { throw new ValidationError(errorMessage); });
  const result = await postTodo({ request: { body } });
  expect(result.status).toBe(400);
  expect(result.body).toBe(errorMessage);
  done();
});

it('should throw unhandled errors', async done => {
  const body = { title: 'post test' };
  const errorMessage = 'model failed validation';
  TodoModel.mockImplementation(() => { throw new Error(errorMessage); });
  await expect(postTodo({ request: { body } })).rejects.toThrowError(errorMessage);
  done();
});
