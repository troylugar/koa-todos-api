it('should return a 200 when todo found', async done => {
  const expected = { title: 'merged' };
  const id = 'abcd';
  const update = { title: 'different' };
  const todoServiceFake = {
    updateById: jest.fn(() => expected)
  };
  const patchTodoWrapper = require('./patch-todo');
  const patchTodo = patchTodoWrapper({ todoService: todoServiceFake });
  const result = await patchTodo({
    params: { id },
    request: { body: update }
  });
  expect(todoServiceFake.updateById).toHaveBeenCalledWith(id, update);
  expect(result.body).toBe(expected);
  expect(result.status).toBe(200);
  done();
});

it('should return a 400 when ValidationError thrown', async done => {
  const id = 'abcd';
  const update = { title: 'update' };
  const errorMessage = 'model failed validation';
  const ValidationError = require('../../errors/validation.error');
  const todoServiceFake = {
    updateById: jest.fn(() => { throw new ValidationError(errorMessage); })
  };
  const patchTodoWrapper = require('./patch-todo');
  const patchTodo = patchTodoWrapper({ todoService: todoServiceFake });
  const result = await patchTodo({ params: { id }, request: { body: update} });
  expect(todoServiceFake.updateById).toHaveBeenCalledWith(id, update);
  expect(result.status).toBe(400);
  expect(result.body).toBe(errorMessage);
  done();
});

it('should return a 404 when todo not found', async done => {
  const NotFoundError = require('../../errors/not-found.error');
  const id = 'abcd';
  const update = { title: 'update' };
  const todoServiceFake = {
    updateById: jest.fn(() => { throw new NotFoundError(); })
  };
  const patchTodoWrapper = require('./patch-todo');
  const patchTodo = patchTodoWrapper({ todoService: todoServiceFake });
  const result = await patchTodo({ params: { id }, request: { body: update} });
  expect(todoServiceFake.updateById).toHaveBeenCalledWith(id, update);
  expect(result.status).toBe(404);
  done();
});

it('should rethrow unhandled errors', async done => {
  const id = 'abcd';
  const update = { title: 'update' };
  const todoServiceFake = {
    updateById: jest.fn(() => { throw new Error(); })
  };
  const patchTodoWrapper = require('./patch-todo');
  const patchTodo = patchTodoWrapper({ todoService: todoServiceFake });
  await expect(patchTodo({ params: { id }, request: { body: update} })).rejects.toThrow(Error);
  expect(todoServiceFake.updateById).toHaveBeenCalledWith(id, update);
  done();
});
