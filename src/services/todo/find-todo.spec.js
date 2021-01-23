const NotFoundError = require('../../errors/not-found.error');
const findTodoWrapper = require('./find-todo');

it('should return todo if found', async done => {
  const id = 'asdf';
  const expected = { asdf: 'asdf' };
  const todoRepository = {
    findById: jest.fn(() => expected)
  };
  const findTodo = findTodoWrapper({todoRepository});
  const result = await findTodo(id);
  expect(result).toBe(expected);
  expect(todoRepository.findById).toHaveBeenCalledWith(id);
  done();
});

it('should throw not found error', async done => {
  const id = 'asdf';
  const todoRepository = {
    findById: jest.fn(() => undefined)
  };
  const findTodo = findTodoWrapper({todoRepository});
  await expect(findTodo(id)).rejects.toThrow(NotFoundError);
  expect(todoRepository.findById).toHaveBeenCalledWith(id);
  done();
});
