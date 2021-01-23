const deleteTodoWrapper = require('./delete-todo');

it('should return a 404 when todo not found', async done => {
  const id = 'abcd';
  const todoServiceFake = {
    deleteById: jest.fn(() => undefined)
  };
  const deleteTodo = deleteTodoWrapper({todoService: todoServiceFake});
  const result = await deleteTodo({ params: { id } });
  expect(todoServiceFake.deleteById).toHaveBeenCalledWith(id);
  expect(result.status).toBe(404);
  done();
});

it('should return a 204 when todo found and deleted', async done => {
  const id = 'abcd';
  const expected = { title: 'asdf' };
  const todoServiceFake = {
    deleteById: jest.fn(() => expected)
  };
  const deleteTodo = deleteTodoWrapper({todoService: todoServiceFake});
  const result = await deleteTodo({ params: { id } });
  expect(todoServiceFake.deleteById).toHaveBeenCalledWith(id);
  expect(result.body).toBeUndefined();
  expect(result.status).toBe(204);
  done();
});