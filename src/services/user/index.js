const userRepository = require('../../repositories/user');
const generateToken = require('../../utilities/generate-token');
const comparePassword = require('../../utilities/compare-password');
const hashPassword = require('../../utilities/hash-password');

module.exports = {
  authenticate: require('./authenticate-user')({ userRepository, generateToken, comparePassword }),
  register: require('./register-user')({ userRepository, hashPassword })
};
