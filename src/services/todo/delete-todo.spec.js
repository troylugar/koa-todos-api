const NotFoundError = require('../../errors/not-found.error');
const deleteTodoWrapper = require('./delete-todo');

it('should not return anything upon success', async done => {
  const id = 'asdf';
  const todoRepository = {
    findByIdAndDelete: jest.fn(() => true)
  };
  const deleteTodo = deleteTodoWrapper({todoRepository});
  await deleteTodo(id);
  expect(todoRepository.findByIdAndDelete).toHaveBeenCalledWith(id);
  done();
});

it('should throw NotFoundError if todo not found', async done => {
  const id = 'asdf';
  const todoRepository = {
    findByIdAndDelete: jest.fn(() => undefined)
  };
  const deleteTodo = deleteTodoWrapper({todoRepository});
  await expect(deleteTodo(id)).rejects.toThrow(NotFoundError);
  expect(todoRepository.findByIdAndDelete).toHaveBeenCalledWith(id);
  done();
});
