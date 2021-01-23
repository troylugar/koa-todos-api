const NotFoundError = require('../../errors/not-found.error');
const deleteTodoWrapper = require('./delete-todo');

it('should return a 404 when NotFoundError thrown', async done => {
  const id = 'abcd';
  const todoServiceFake = {
    deleteById: jest.fn(() => { throw new NotFoundError(); })
  };
  const deleteTodo = deleteTodoWrapper({todoService: todoServiceFake});
  const result = await deleteTodo({ params: { id } });
  expect(todoServiceFake.deleteById).toHaveBeenCalledWith(id);
  expect(result.status).toBe(404);
  done();
});

it('should throw unhandled errors', async done => {
  const id = 'abcd';
  const todoServiceFake = {
    deleteById: jest.fn(() => { throw new Error(); })
  };
  const deleteTodo = deleteTodoWrapper({todoService: todoServiceFake});
  await expect(deleteTodo({ params: { id } })).rejects.toThrow(Error);
  expect(todoServiceFake.deleteById).toHaveBeenCalledWith(id);
  done();
});

it('should return a 204 when todo found and deleted', async done => {
  const id = 'abcd';
  const todoServiceFake = {
    deleteById: jest.fn()
  };
  const deleteTodo = deleteTodoWrapper({todoService: todoServiceFake});
  const result = await deleteTodo({ params: { id } });
  expect(todoServiceFake.deleteById).toHaveBeenCalledWith(id);
  expect(result.body).toBeUndefined();
  expect(result.status).toBe(204);
  done();
});