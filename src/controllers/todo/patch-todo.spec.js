const NotFoundError = require('../../errors/not-found.error');
const ValidationError = require('../../errors/validation.error');
const { todoService } = require('../../services');
const patchTodo = require('./patch-todo');

jest.mock('../../services');

afterEach(() => {
  jest.resetAllMocks();
});

it('should return a 200 when todo found', async done => {
  const expected = { title: 'merged' };
  const id = 'abcd';
  const update = { title: 'different' };
  todoService.updateById.mockImplementation(() => expected);
  const result = await patchTodo({
    params: { id },
    request: { body: update }
  });
  expect(todoService.updateById).toHaveBeenCalledWith(id, update);
  expect(result.body).toBe(expected);
  expect(result.status).toBe(200);
  done();
});

it('should return a 400 when ValidationError thrown', async done => {
  const id = 'abcd';
  const update = { title: 'update' };
  const errorMessage = 'model failed validation';
  todoService.updateById.mockImplementation(() => {
    throw new ValidationError(errorMessage);
  });
  const result = await patchTodo({ params: { id }, request: { body: update } });
  expect(todoService.updateById).toHaveBeenCalledWith(id, update);
  expect(result.status).toBe(400);
  expect(result.body).toBe(errorMessage);
  done();
});

it('should return a 404 when todo not found', async done => {
  const id = 'abcd';
  const update = { title: 'update' };
  todoService.updateById.mockImplementation(() => {
    throw new NotFoundError();
  });
  const result = await patchTodo({ params: { id }, request: { body: update } });
  expect(todoService.updateById).toHaveBeenCalledWith(id, update);
  expect(result.status).toBe(404);
  done();
});

it('should rethrow unhandled errors', async done => {
  const id = 'abcd';
  const update = { title: 'update' };
  todoService.updateById.mockImplementation(() => { throw new Error(); });
  await expect(patchTodo({ params: { id }, request: { body: update } })).rejects.toThrow(Error);
  expect(todoService.updateById).toHaveBeenCalledWith(id, update);
  done();
});
