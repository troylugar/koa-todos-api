const requireRoles = require('./require-roles');

it('should return Not Authorized when not logged in', () => {
  const ctx = {};
  const next = jest.fn();
  const result = requireRoles(['asdf'])(ctx, next);
  expect(result.status).toBe(401);
});

it('should return Not Authorized when the user has no roles', () => {
  const ctx = { token: {} };
  const next = jest.fn();
  const result = requireRoles(['asdf'])(ctx, next);
  expect(result.status).toBe(401);
});

it('should return Not Authorized when the user does not have the required role', () => {
  const ctx = { token: { roles: ['jkl'] } };
  const next = jest.fn();
  const result = requireRoles(['asdf'])(ctx, next);
  expect(result.status).toBe(401);
});

it('should call next when the user has the required roles', () => {
  const ctx = { token: { roles: ['asdf', 'jkl', 'zxcv'] } };
  const next = jest.fn();
  requireRoles(['asdf', 'jkl'])(ctx, next);
  expect(next).toHaveBeenCalledWith(ctx);
});