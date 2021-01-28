const TodoModel = require('../../models/todo');
const NotFoundError = require('../../errors/not-found.error');
const updateTodoWrapper = require('./update-todo');
const todoRepository = require('../../repositories/todo');
const updateTodo = updateTodoWrapper({ todoRepository });

jest.mock('../../models/todo'); //, () => mockTodoModel);
jest.mock('../../repositories/todo');

afterEach(() => {
  jest.resetAllMocks();
});

it('should return the updated todo if found', async done => {
  const id = 'an id';
  const update = { input: 'asdf' };

  const mockFound = { asdf: 'asdf' };
  const mockMerged = { ...mockFound, ...update };
  todoRepository.findById.mockReturnValue(mockFound);
  TodoModel.mockReturnValue(mockMerged);

  const result = await updateTodo(id, update);
  expect(result).toStrictEqual(mockMerged);
  expect(todoRepository.findByIdAndUpdate).toHaveBeenCalledWith(id, mockMerged);
  done();
});

it('should throw not found error', async done => {
  const id = 'an id';
  const update = { input: 'asdf' };

  await expect(updateTodo(id, update)).rejects.toThrow(NotFoundError);
  
  expect(todoRepository.findById).toHaveBeenCalledWith(id);
  done();
});