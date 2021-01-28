const ValidationError = require('../../errors/validation.error');
const validators = require('../../validators');
const userRepository = require('../../repositories/user');
const hashPassword = require('../../utilities/hash-password');
const registerUserWrapper = require('./register-user');

jest.mock('../../validators');
jest.mock('../../repositories/user');
jest.mock('../../utilities/hash-password');

const registerUser = registerUserWrapper({ userRepository, hashPassword, validators });

afterEach(() => {
  jest.resetAllMocks();
});

it('should hash password before inserting user', async done => {
  const user = {
    username: 'troy',
    password: 'C!e4rtext'
  };
  const hashedPassword = 'sdflkne9cnwefoi';
  hashPassword.mockReturnValue(hashedPassword);
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
  const mockMinLength = jest.fn();
  validators.validateMultiple.mockImplementation(() => { throw new ValidationError(); });
  validators.hasMinLength.mockImplementation(() => mockMinLength);
  await expect(registerUser(user)).rejects.toThrow(ValidationError);
  expect(validators.hasMinLength).toHaveBeenCalledWith(8);
  expect(validators.validate).toHaveBeenCalledWith(undefined, validators.isFalsy, 'username is already being used');
  expect(validators.validate).toHaveBeenCalledWith(user.password, validators.isString, 'password must be a string');
  expect(validators.validate).toHaveBeenCalledWith(user.password, mockMinLength, 'password must have length >= 8');
  expect(validators.validate).toHaveBeenCalledWith(user.password, validators.containsSpecialChars, 'password must contain at least 1 special character');
  expect(validators.validate).toHaveBeenCalledWith(user.password, validators.containsNumbers, 'password must contain at least 1 number');
  expect(hashPassword).not.toHaveBeenCalled();
  expect(userRepository.insert).not.toHaveBeenCalled();
  done();
});
