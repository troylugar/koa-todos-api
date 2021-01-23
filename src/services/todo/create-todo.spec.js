const saveTodoWrapper = require('./create-todo');

it('should use the repository to create the todo', async done => {
  const input = { input: 'asdf' };
  const expected = { asdf: 'asdf' };
  const todoRepository = {
    insert: jest.fn(() => expected)
  };
  const saveTodo = saveTodoWrapper({todoRepository});
  const result = await saveTodo(input);
  expect(result).toBe(expected);
  expect(todoRepository.insert).toHaveBeenCalledWith(input);
  done();
});