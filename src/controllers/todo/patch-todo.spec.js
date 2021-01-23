afterEach(() => {
  jest.resetModules();
});

it('should return a 404 when todo not found', async done => {
  const patchTodoWrapper = require('./patch-todo');
  const id = 'abcd';
  const todoServiceFake = {
    findById: jest.fn(() => undefined)
  };
  const patchTodo = patchTodoWrapper({todoService: todoServiceFake});
  const result = await patchTodo({ params: { id } });
  expect(todoServiceFake.findById).toHaveBeenCalledWith(id);
  expect(result.status).toBe(404);
  done();
});

it('should return a 200 when todo found', async done => {
  const merged = { title: 'merged' };
  jest.mock('../../models/todo', () => jest.fn(() => merged));
  const patchTodoWrapper = require('./patch-todo');
  const id = 'abcd';
  const expected = { title: 'asdf' };
  const updated = { title: 'different' };
  const todoServiceFake = {
    findById: jest.fn(() => expected),
    updateById: jest.fn(() => updated)
  };
  const patchTodo = patchTodoWrapper({todoService: todoServiceFake});
  const result = await patchTodo({ params: { id }, body: updated });
  expect(todoServiceFake.findById).toHaveBeenCalledWith(id);
  expect(result.body).toBe(merged);
  expect(result.status).toBe(200);
  done();
});