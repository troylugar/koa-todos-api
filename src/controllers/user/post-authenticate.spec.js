const AuthenticationError = require('../../errors/authentication.error');
const postAuthenticateWrapper = require('./post-authenticate');

it('should return token when authentication is successful', async done => {
  const token = { uid: 'abc123' };
  const userService = {
    authenticate: jest.fn(() => token)
  };
  const postAuthenticate = postAuthenticateWrapper({ userService });
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
  const errorMessage = 'username and password do not match';
  const userService = {
    authenticate: jest.fn(() => {
      throw new AuthenticationError(errorMessage);
    })
  };
  const postAuthenticate = postAuthenticateWrapper({ userService });
  const context = {
    request: {
      body: { username: 'troy', password: 'password' }
    }
  };
  const result = await postAuthenticate(context);
  expect(result.status).toBe(401);
  expect(result.body).toBe(errorMessage);
  done();
});

it('should throw unhandled errors', async done => {
  const userService = {
    authenticate: jest.fn(() => {
      throw new Error();
    })
  };
  const postAuthenticate = postAuthenticateWrapper({ userService });
  const context = {
    request: {
      body: { username: 'troy', password: 'password' }
    }
  };
  await expect(postAuthenticate(context)).rejects.toThrow(Error);
  done();
});
