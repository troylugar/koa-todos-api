const deleteTodoWrapper = require('./delete-todo');

it('should use the repository to delete the todo', async done => {
  const id = 'asdf';
  const expected = { asdf: 'asdf' };
  const todoRepository = {
    findByIdAndDelete: jest.fn(() => expected)
  };
  const deleteTodo = deleteTodoWrapper({todoRepository});
  const result = await deleteTodo(id);
  expect(result).toBe(expected);
  expect(todoRepository.findByIdAndDelete).toHaveBeenCalledWith(id);
  done();
});