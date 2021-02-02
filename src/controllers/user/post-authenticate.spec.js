const { userService } = require('../../services');
const AuthenticationError = require('../../errors/authentication.error');
const postAuthenticate = require('./post-authenticate');

jest.mock('../../services');

it('should return token when authentication is successful', async done => {
  const token = { uid: 'abc123' };
  userService.authenticate.mockImplementation(() => token);
  const context = {
    request: {
      body: { username: 'troy', password: 'password' }
    }
  };
  const result = await postAuthenticate(context);
  expect(result.status).toBe(200);
  expect(result.body).toStrictEqual({ token });
  done();
});

it('should return a 401 when AuthenticationError thrown', async done => {
  const error = new AuthenticationError('username and password do not match');
  userService.authenticate.mockImplementation(() => {
    throw error;
  });
  const context = {
    request: {
      body: { username: 'troy', password: 'password' }
    }
  };
  const result = await postAuthenticate(context);
  expect(result.status).toBe(401);
  expect(result.body).toBe(error);
  done();
});

it('should throw unhandled errors', async done => {
  userService.authenticate.mockImplementation(() => {
    throw new Error();
  });
  const context = {
    request: {
      body: { username: 'troy', password: 'password' }
    }
  };
  await expect(postAuthenticate(context)).rejects.toThrow(Error);
  done();
});
