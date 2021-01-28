const ValidationError = require('../../errors/validation.error');
const registerUserWrapper = require('./register-user');

it('should hash password before inserting user', async done => {
  const user = {
    username: 'troy',
    password: 'C!e4rtext'
  };
  const hashedPassword = 'sdflkne9cnwefoi';
  const userRepository = {
    findByUsername: jest.fn(),
    insert: jest.fn()
  };
  const hashPassword = jest.fn(() => hashedPassword);
  const registerUser = registerUserWrapper({
    userRepository,
    hashPassword,
    validators: {
      validateMultiple: jest.fn(),
      validate: jest.fn(),
      hasMinLength: jest.fn()
    }
  });
  await registerUser(user);
  const args = userRepository.insert.mock.calls[0][0];
  expect(hashPassword).toHaveBeenCalledWith(user.password);
  expect(args.password).toBe(hashedPassword);
  done();
});

it('should validate password before hashing', async done => {
  const user = {
    username: 'troy',
    password: 'asdf'
  };
  const userRepository = {
    findByUsername: jest.fn(),
    insert: jest.fn()
  };
  const hashPassword = jest.fn();
  const mockMinLength = jest.fn();
  const validators = {
    validateMultiple: jest.fn(() => { throw new ValidationError(); }),
    validate: jest.fn(),
    hasMinLength: jest.fn(() => mockMinLength),
    isString: jest.fn(),
    containsSpecialChars: jest.fn(),
    containsNumbers: jest.fn(),
    isFalsy: jest.fn()
  };
  const registerUser = registerUserWrapper({
    userRepository,
    hashPassword,
    validators
  });
  await expect(registerUser(user)).rejects.toThrow(ValidationError);
  expect(validators.hasMinLength).toHaveBeenLastCalledWith(8);
  expect(validators.validate).toHaveBeenCalledWith(undefined, validators.isFalsy, 'username is already being used');
  expect(validators.validate).toHaveBeenCalledWith(user.password, validators.isString, 'password must be a string');
  expect(validators.validate).toHaveBeenCalledWith(user.password, mockMinLength, 'password must have length >= 8');
  expect(validators.validate).toHaveBeenCalledWith(user.password, validators.containsSpecialChars, 'password must contain at least 1 special character');
  expect(validators.validate).toHaveBeenCalledWith(user.password, validators.containsNumbers, 'password must contain at least 1 number');
  expect(hashPassword).not.toHaveBeenCalled();
  expect(userRepository.insert).not.toHaveBeenCalled();
  done();
});
