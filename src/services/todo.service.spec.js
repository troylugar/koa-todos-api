const NotFoundError = require('../errors/not-found.error');
const { Todo } = require('../models');
const TodoService = require('./todo.service');

jest.mock('../models');

const mockTodoRepository = {};
const todoService = new TodoService(mockTodoRepository);

describe('create', () => {
  it('should use the repository to create the todo', async done => {
    const input = { input: 'asdf' };
    const expected = { asdf: 'asdf' };
    mockTodoRepository.insert = jest.fn(() => expected);
    const result = await todoService.create(input);
    expect(result).toBe(expected);
    expect(mockTodoRepository.insert).toHaveBeenCalledWith(input);
    done();
  });
});

describe('findById', () => {
  it('should return todo if found', async done => {
    const id = 'asdf';
    const expected = { asdf: 'asdf' };
    mockTodoRepository.findById = jest.fn(() => expected);
    const result = await todoService.findById(id);
    expect(result).toBe(expected);
    expect(mockTodoRepository.findById).toHaveBeenCalledWith(id);
    done();
  });
  
  it('should throw not found error', async done => {
    const id = 'asdf';
    mockTodoRepository.findById = jest.fn(() => undefined);
    await expect(todoService.findById(id)).rejects.toThrow(NotFoundError);
    expect(mockTodoRepository.findById).toHaveBeenCalledWith(id);
    done();
  });
});

describe('updateById', () => {
  it('should return the updated todo if found', async done => {
    const id = 'an id';
    const update = { input: 'asdf' };
  
    const mockFound = { asdf: 'asdf' };
    const mockMerged = { ...mockFound, ...update };
    mockTodoRepository.findById = jest.fn(() => mockFound);
    mockTodoRepository.findByIdAndUpdate = jest.fn();
    Todo.mockImplementation(() => mockMerged);
  
    const result = await todoService.updateById(id, update);
    expect(result).toStrictEqual(mockMerged);
    expect(mockTodoRepository.findByIdAndUpdate).toHaveBeenCalledWith(id, mockMerged);
    done();
  });
  
  it('should throw not found error', async done => {
    const id = 'an id';
    const update = { input: 'asdf' };
    mockTodoRepository.findById = jest.fn();
  
    await expect(todoService.updateById(id, update)).rejects.toThrow(NotFoundError);
    
    expect(mockTodoRepository.findById).toHaveBeenCalledWith(id);
    done();
  });
});

describe('deleteById', () => {
  it('should return todo if successfully deleted', async done => {
    const id = 'asdf';
    const expected = { asdf: 'asdf' };
    mockTodoRepository.findByIdAndDelete = jest.fn(() => expected);
    const result = await todoService.deleteById(id);
    expect(result).toBe(expected);
    expect(mockTodoRepository.findByIdAndDelete).toHaveBeenCalledWith(id);
    done();
  });
  
  it('should throw not found error', async done => {
    const id = 'asdf';
    mockTodoRepository.findByIdAndDelete = jest.fn();
    await expect(todoService.deleteById(id)).rejects.toThrow(NotFoundError);
    expect(mockTodoRepository.findByIdAndDelete).toHaveBeenCalledWith(id);
    done();
  });
});

describe('deleteById', () => {
  it('should pass back data from repository', async done => {
    mockTodoRepository.find = jest.fn();
    await todoService.list();
    expect(mockTodoRepository.find).toBeCalled();
    done();
  });
});