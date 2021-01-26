const AuthenticationError = require('../../errors/authentication.error');
const authenticateUserWrapper = require('./authenticate-user');

it('should throw authentication error if user not found', async done => {
  const userRepository = {
    findByUsername: jest.fn()
  };
  const comparePassword = jest.fn(() => true);
  const generateToken = jest.fn();
  const authenticateUser = authenticateUserWrapper({
    userRepository,
    comparePassword,
    generateToken
  });
  await expect(authenticateUser('troy', 'password')).rejects.toThrow(AuthenticationError);
  done();
});

it('should throw authentication error if passwords do not match', async done => {
  const userRepository = {
    findByUsername: jest.fn(() => ({
      password: 'asdf'
    }))
  };
  const comparePassword = jest.fn(() => false);
  const generateToken = jest.fn(() => ({
    uid: 'abc123',
    roles: []
  }));
  const authenticateUser = authenticateUserWrapper({
    userRepository,
    comparePassword,
    generateToken
  });
  await expect(authenticateUser('troy', 'password')).rejects.toThrow(AuthenticationError);
  done();
});

it('should return token for valid credentials', async done => {
  const mockUser = {
    id: 'abc123',
    username: 'troy',
    password: 'asdf',
    roles: ['admin']
  };
  const userRepository = {
    findByUsername: jest.fn(() => mockUser)
  };
  const comparePassword = jest.fn(() => true);
  const generateToken = jest.fn();
  const authenticateUser = authenticateUserWrapper({
    userRepository,
    comparePassword,
    generateToken
  });
  await authenticateUser('troy', 'password');
  expect(generateToken.mock.calls[0][0].uid).toBe(mockUser.id);
  expect(generateToken.mock.calls[0][0].roles).toBe(mockUser.roles);
  done();
});
