const jwt = require('jsonwebtoken');
const config = require('./config');

const { privateKey } = config;
const options = {
  algorithm: config.jwt.algorithm,
  expiresIn: config.jwt.expiresIn
};

function generateToken(payload) {
  return jwt.sign(payload, privateKey, options);
}

module.exports = generateToken;