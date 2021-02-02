const NotFoundError = require('../../errors/not-found.error');
const { todoService } = require('../../services');
const getTodo = require('./get-todo');

jest.mock('../../services');

afterEach(() => {
  jest.resetAllMocks();
});

it('should return a 404 when todo not found', async done => {
  const id = 'abcd';
  todoService.findById.mockImplementation(() => { throw new NotFoundError(); });
  const result = await getTodo({ params: { id } });
  expect(todoService.findById).toHaveBeenCalledWith(id);
  expect(result.status).toBe(404);
  done();
});

it('should throw unhandled errors', async done => {
  const id = 'abcd';
  todoService.findById.mockImplementation(() => { throw new Error(); });
  await expect(getTodo({ params: { id } })).rejects.toThrow(Error);
  expect(todoService.findById).toHaveBeenCalledWith(id);
  done();
});

it('should return a 200 when todo found', async done => {
  const id = 'abcd';
  const expected = { title: 'asdf' };
  todoService.findById.mockImplementation(() => expected);
  const result = await getTodo({ params: { id } });
  expect(todoService.findById).toHaveBeenCalledWith(id);
  expect(result.body).toBe(expected);
  expect(result.status).toBe(200);
  done();
});