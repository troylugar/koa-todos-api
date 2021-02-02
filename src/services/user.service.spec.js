const AuthenticationError = require('../errors/authentication.error');
const ValidationError = require('../errors/validation.error');
const generateToken = require('../utilities/generate-token');
const comparePassword = require('../utilities/compare-password');
const hashPassword = require('../utilities/hash-password');
const validators = require('../validators');
const UserService = require('./user.service');
const mockUserRepository = {
  findByUsername: jest.fn(),
  insert: jest.fn()
};

jest.mock('../utilities/generate-token');
jest.mock('../utilities/compare-password');
jest.mock('../utilities/hash-password');
jest.mock('../validators');

const userService = new UserService(mockUserRepository);

describe('register', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should hash password before inserting user', async done => {
    const userData = {
      username: 'troy',
      password: 'C!e4rtext'
    };
    const hashedPassword = 'sdflkne9cnwefoi';
    hashPassword.mockReturnValue(hashedPassword);
    await userService.register(userData);
    const args = mockUserRepository.insert.mock.calls[0][0];
    expect(hashPassword).toHaveBeenCalledWith(userData.password);
    expect(args.password).toBe(hashedPassword);
    done();
  });
  
  it('should validate password before hashing', async done => {
    const userData = {
      username: 'troy',
      password: 'asdf'
    };
    const mockMinLength = jest.fn();
    validators.validateMultiple.mockImplementation(() => { throw new ValidationError(); });
    validators.hasMinLength.mockImplementation(() => mockMinLength);
    await expect(userService.register(userData)).rejects.toThrow(ValidationError);
    expect(validators.hasMinLength).toHaveBeenCalledWith(8);
    expect(validators.validate).toHaveBeenCalledWith(undefined, validators.isFalsy, 'username is already being used');
    expect(validators.validate).toHaveBeenCalledWith(userData.password, validators.isString, 'password must be a string');
    expect(validators.validate).toHaveBeenCalledWith(userData.password, mockMinLength, 'password must have length >= 8');
    expect(validators.validate).toHaveBeenCalledWith(userData.password, validators.containsSpecialChars, 'password must contain at least 1 special character');
    expect(validators.validate).toHaveBeenCalledWith(userData.password, validators.containsNumbers, 'password must contain at least 1 number');
    expect(hashPassword).not.toHaveBeenCalled();
    expect(mockUserRepository.insert).not.toHaveBeenCalled();
    done();
  });
});

describe('authenticate', () => {
  it('should throw authentication error if user not found', async done => {
    mockUserRepository.findByUsername = jest.fn();
    comparePassword.mockImplementation(() => true);
    generateToken.mockImplementation();
    await expect(userService.authenticate('troy', 'password')).rejects.toThrow(AuthenticationError);
    done();
  });

  it('should throw authentication error if passwords do not match', async done => {
    mockUserRepository.findByUsername = jest.fn(() => ({
      password: 'asdf'
    }));
    comparePassword.mockImplementation(() => false);
    generateToken.mockImplementation(() => ({
      uid: 'abc123',
      roles: []
    }));
    await expect(userService.authenticate('troy', 'password')).rejects.toThrow(AuthenticationError);
    done();
  });

  it('should return token for valid credentials', async done => {
    const mockUser = {
      id: 'abc123',
      username: 'troy',
      password: 'asdf',
      roles: ['admin']
    };
    mockUserRepository.findByUsername = jest.fn(() => mockUser);
    comparePassword.mockImplementation(() => true);
    generateToken.mockImplementation();
    await userService.authenticate('troy', 'password');
    expect(generateToken.mock.calls[0][0].uid).toBe(mockUser.id);
    expect(generateToken.mock.calls[0][0].roles).toBe(mockUser.roles);
    done();
  });
});
