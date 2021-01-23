const findTodoWrapper = require('./find-todo');

it('should use the repository to find the todo', async done => {
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