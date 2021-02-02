const NotFoundError = require('../../errors/not-found.error');
const { todoService } = require('../../services');
const deleteTodo = require('./delete-todo');
jest.mock('../../services');

afterEach(() => {
  jest.resetAllMocks();
});

it('should return a 404 when NotFoundError thrown', async done => {
  const id = 'abcd';
  todoService.deleteById.mockImplementation(() => {
    throw new NotFoundError();
  });
  const result = await deleteTodo({ params: { id } });
  expect(todoService.deleteById).toHaveBeenCalledWith(id);
  expect(result.status).toBe(404);
  done();
});

it('should throw unhandled errors', async done => {
  const id = 'abcd';
  todoService.deleteById.mockImplementation(() => { throw new Error(); });
  await expect(deleteTodo({ params: { id } })).rejects.toThrow(Error);
  expect(todoService.deleteById).toHaveBeenCalledWith(id);
  done();
});

it('should return a 204 when todo found and deleted', async done => {
  const id = 'abcd';
  const result = await deleteTodo({ params: { id } });
  expect(todoService.deleteById).toHaveBeenCalledWith(id);
  expect(result.body).toBeUndefined();
  expect(result.status).toBe(204);
  done();
});