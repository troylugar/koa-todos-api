const verifyToken = require('../utilities/verify-token');
const auth = require('./authorize');
const AuthenticationError = require('../errors/authentication.error');

jest.mock('../utilities/verify-token');

it('should verify a valid token', async done => {
  const ctx = {
    request: {
      headers: {
        auth: 'Bearer qwerty'
      }
    }
  };
  verifyToken.mockImplementation(() => ({asdf: 'jkl'}));
  const mockNext = jest.fn();
  const result = await auth(ctx, mockNext);
  expect(result).toBeUndefined();
  expect(ctx.token.asdf).toBe('jkl');
  done();
});

it('should return Not Authorized when no auth header given', async done => {
  const ctx = {
    request: {
      headers: {
      }
    }
  };
  const mockNext = jest.fn();
  await auth(ctx, mockNext);
  expect(ctx.status).toBe(401);
  done();
});

it('should return Not Authorized when verified unsuccessfully', async done => {
  const mockError = 'error message';
  verifyToken.mockImplementation(() => { throw new AuthenticationError(mockError); });
  const ctx = {
    request: {
      headers: {
        auth: 'Bearer asdf'
      }
    }
  };
  const mockNext = jest.fn();
  await auth(ctx, mockNext);
  expect(ctx.status).toBe(401);
  expect(ctx.body.message).toBe(mockError);
  done();
});

it('should throw unhandled errors', async done => {
  verifyToken.mockImplementation(() => { throw new Error('asdf'); });
  const ctx = {
    request: {
      headers: {
        auth: 'Bearer asdf'
      }
    }
  };
  const mockNext = jest.fn();
  await expect(auth(ctx, mockNext)).rejects.toThrow('asdf');
  done();
});
