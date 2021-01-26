let jwt, auth;

const {
  auth_private_key: privateKey
} = require('../utilities/config');

beforeEach(() => {
  jwt = require('jsonwebtoken');
  auth = require('./authorize');
});

it('should add token payload to context given a valid token', async done => {
  const payload = {
    user: 'troy'
  };
  const token = jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: 60 * 60
  });
  const ctx = {
    request: {
      headers: {
        auth: 'Bearer ' + token
      }
    }
  };
  const mockNext = jest.fn();
  auth(ctx, mockNext);
  expect(ctx.token.user).toBe(payload.user);
  expect(mockNext).toHaveBeenCalledWith(ctx);
  done();
});

it('should verify a valid token', async done => {
  const token = jwt.sign({asdf: 'jkl'}, privateKey, { algorithm: 'RS256', expiresIn: 60 * 60 });
  const ctx = {
    request: {
      headers: {
        auth: 'Bearer ' + token
      }
    }
  };
  const mockNext = jest.fn;
  const result = auth(ctx, mockNext);
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
  const mockNext = jest.fn;
  const result = auth(ctx, mockNext);
  expect(result.status).toBe(401);
  done();
});

it('should return Not Authorized given a malformed token', async done => {
  const ctx = {
    request: {
      headers: {
        auth: 'Bearer asdf'
      }
    }
  };
  const mockNext = jest.fn;
  const result = auth(ctx, mockNext);
  expect(result.status).toBe(401);
  done();
});

it('should return Not Authorized given an invalid token', async done => {
  const ctx = {
    request: {
      headers: {
        auth: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.POstGetfAytaZS82wHcjoTyoqhMyxXiWdR7Nn7A29DNSl0EiXLdwJ6xC6AfgZWF1bOsS_TuYI3OG85AmiExREkrS6tDfTQ2B3WXlrr-wp5AokiRbz3_oB4OxG-W9KcEEbDRcZc0nH3L7LzYptiy1PtAylQGxHTWZXtGz4ht0bAecBgmpdgXMguEIcoqPJ1n3pIWk_dUZegpqx0Lka21H6XxUTxiy8OcaarA8zdnPUnV6AmNP3ecFawIFYdvJB_cm-GvpCSbr8G8y_Mllj8f4x9nBH8pQux89_6gUY618iYv7tuPWBFfEbLxtF2pZS6YC1aSfLQxeNe8djT9YjpvRZA'
      }
    }
  };
  const mockNext = jest.fn;
  const result = auth(ctx, mockNext);
  expect(result.status).toBe(401);
  done();
});
