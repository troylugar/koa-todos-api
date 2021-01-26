const jwt = require('jsonwebtoken');
const config = require('./config');
const privateKey = config.auth_private_key;

function generateToken(payload) {
  return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
}

module.exports = generateToken;