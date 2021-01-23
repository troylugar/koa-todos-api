const mockTodoModel = jest.fn(x => x);
jest.mock('../../models/todo', () => mockTodoModel);
const NotFoundError = require('../../errors/not-found.error');
const updateTodoWrapper = require('./update-todo');

it('should return the updated todo if found', async done => {
  const id = 'an id';
  const update = { input: 'asdf' };
  const found = { asdf: 'asdf' };
  const merged = { ...found, ...update };
  const todoRepository = {
    findById: jest.fn(() => found),
    findByIdAndUpdate: jest.fn()
  };
  const updateTodo = updateTodoWrapper({todoRepository});
  const result = await updateTodo(id, update);
  expect(mockTodoModel).toHaveBeenCalledWith(merged);
  expect(result).toStrictEqual(merged);
  expect(todoRepository.findByIdAndUpdate).toHaveBeenCalledWith(id, merged);
  done();
});

it('should throw not found error', async done => {
  const id = 'an id';
  const update = { input: 'asdf' };
  const todoRepository = {
    findById: jest.fn(),
  };
  const updateTodo = updateTodoWrapper({todoRepository});
  await expect(updateTodo(id, update)).rejects.toThrow(NotFoundError);
  expect(todoRepository.findById).toHaveBeenCalledWith(id);
  done();
});