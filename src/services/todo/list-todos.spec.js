const listTodosWrapper = require('./list-todos');

it('should use the repository to list the todos', async done => {
  const expected = { asdf: 'asdf' };
  const todoRepository = {
    find: jest.fn(() => expected)
  };
  const listTodos = listTodosWrapper({todoRepository});
  const result = await listTodos();
  expect(result).toBe(expected);
  expect(todoRepository.find).toHaveBeenCalled();
  done();
});