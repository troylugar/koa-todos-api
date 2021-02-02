const config = require('./config');
const jwt = require('jsonwebtoken');
const verifyToken = require('./verify-token');
const AuthenticationError = require('../errors/authentication.error');

jest.mock('jsonwebtoken');

it('should transform handlable errors into AuthenticationError', () => {
  const token = 'not_a_token';
  jwt.verify.mockImplementation(() => { throw { name: 'TokenExpiredError' }; });
  expect(() => {
    verifyToken(token);
  }).toThrow(AuthenticationError);
  expect(jwt.verify).toHaveBeenCalledWith(
    token,
    config.publicKey,
    { algorithm: 'RS256' }
  );
});

it('should throw unhandled errors', () => {
  const token = 'not_a_token';
  jwt.verify.mockImplementation(() => { throw new Error('asdf'); });
  expect(() => {
    verifyToken(token);
  }).toThrow(Error);
  expect(jwt.verify).toHaveBeenCalledWith(
    token,
    config.publicKey,
    { algorithm: 'RS256' }
  );
});