const uuid = require('../utilities/generate-uuid');
const now = require('../utilities/generate-date');
const validators = require('../validators');
const Todo = require('./todo.model');

const mockNow = Date.now();

jest.mock('../utilities/generate-uuid');
uuid.mockReturnValue('a_random_id');
jest.mock('../utilities/generate-date');
now.mockReturnValue(mockNow);
jest.mock('../validators');

describe('successful validation', () => {
  const minLength = jest.fn();
  validators.isString.mockImplementation();
  validators.hasMinLength.mockImplementation(() => minLength);
  validators.validate.mockImplementation();
  validators.validateMultiple.mockImplementation();

  it('should create a todo from args', () => {
    const data = {
      id: 'a different id',
      title: 'My todo',
      completed: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const myModel = new Todo(data);
    expect(myModel).toEqual(data);
  });

  it('should create a todo from defaults', () => {
    const title = 'My todo';
    const defaults = {
      id: uuid(),
      title,
      completed: false,
      createdAt: mockNow,
      updatedAt: mockNow
    };
    const myModel = new Todo({ title });
    expect(myModel).toEqual(defaults);
  });

  it('should validate that title is a string', () => {
    const title = 'this is the title';
    new Todo({ title });
    const expectedMessage = 'title must be a string';
    expect(validators.validate).toHaveBeenCalledWith(title, validators.isString, expectedMessage);
  });

  it('should validate that title has a length >= 3', () => {
    const title = 'this is the title';
    new Todo({ title });
    const expectedMessage = 'title must have a length >= 3';
    expect(validators.hasMinLength).toHaveBeenCalledWith(3);
    expect(validators.validate).toHaveBeenCalledWith(title, minLength, expectedMessage);
  });
});

describe('unsuccessful validation', () => {
  it('should throw error upon unsuccessful validation', () => {
    const error = new Error('error message');
    validators.validateMultiple.mockImplementation(() => { throw error; });
    expect(() => new Todo()).toThrow(error);
  });
});