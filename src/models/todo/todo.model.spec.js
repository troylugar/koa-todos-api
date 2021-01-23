const TodoModelWrapper = require('./todo.model');

const NOW = Date.now();

const uuid = () => 'a_random_id';
const now = () => NOW;

describe('successful validation', () => {
  const minLength = jest.fn();
  const validators = {
    isString: jest.fn(),
    hasMinLength: jest.fn(() => minLength),
    validate: jest.fn(),
    validateMultiple: jest.fn()
  };
  const TodoModel = TodoModelWrapper({ uuid, now, validators });

  it('should create a todo from args', () => {
    const data = {
      id: 'a different id',
      title: 'My todo',
      completed: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const myModel = TodoModel(data);
    expect(myModel).toStrictEqual(data);
  });

  it('should create a todo from defaults', () => {
    const title = 'My todo';
    const defaults = {
      id: uuid(),
      title,
      completed: false,
      createdAt: NOW,
      updatedAt: NOW
    };
    const myModel = TodoModel({ title });
    expect(myModel).toStrictEqual(defaults);
  });

  it('should validate that title is a string', () => {
    const title = 'this is the title';
    TodoModel({ title });
    const expectedMessage = 'title must be a string';
    expect(validators.validate).toHaveBeenCalledWith(title, validators.isString, expectedMessage);
  });

  it('should validate that title has a length >= 3', () => {
    const title = 'this is the title';
    TodoModel({ title });
    const expectedMessage = 'title must have a length >= 3';
    expect(validators.hasMinLength).toHaveBeenCalledWith(3);
    expect(validators.validate).toHaveBeenCalledWith(title, minLength, expectedMessage);
  });
});

describe('unsuccessful validation', () => {
  const error = new Error('error message');
  const validators = {
    isString: jest.fn(),
    hasMinLength: () => jest.fn(),
    validate: () => jest.fn()
  };

  it('should throw error upon unsuccessful validation', () => {
    validators.validateMultiple = jest.fn(() => { throw error; });
    const TodoModel = TodoModelWrapper({ uuid, now, validators });
    expect(() => TodoModel()).toThrowError(error.message);
  });
});