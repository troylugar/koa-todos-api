const updateTodoWrapper = require('./update-todo');

it('should use the repository to update the todo', async done => {
  const id = 'an id';
  const update = { input: 'asdf' };
  const expected = { asdf: 'asdf' };
  const todoRepository = {
    findByIdAndUpdate: jest.fn(() => expected)
  };
  const updateTodo = updateTodoWrapper({todoRepository});
  const result = await updateTodo(id, update);
  expect(result).toBe(expected);
  expect(todoRepository.findByIdAndUpdate).toHaveBeenCalledWith(id, update);
  done();
});