const jwt = require('jsonwebtoken');
const AuthenticationError = require('../errors/authentication.error');
const config = require('../utilities/config');
const { publicKey } = config;

const jwtErrors = [
  'TokenExpiredError',
  'JsonWebTokenError',
  'NotBeforeError'
];

function verifyToken(token) {
  try {
    return jwt.verify(token, publicKey, { algorithm: 'RS256' });
  } catch (err) {
    if (jwtErrors.includes(err.name)) {
      throw new AuthenticationError(err.message);
    }
    throw err;
  }
}

module.exports = verifyToken;
