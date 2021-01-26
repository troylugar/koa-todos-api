const AuthenticationError = require('../../errors/authentication.error');

function authenticateUserWrapper({ userRepository, comparePassword, generateToken }) {
  return async function authenticateUser(username, password) {
    const user = await userRepository.findByUsername(username);
    if (!user || !(await comparePassword(password, user.password))) {
      throw new AuthenticationError('username/password mismatch');
    }
    return generateToken({
      uid: user.id,
      roles: user.roles
    });
  };
}

module.exports = authenticateUserWrapper;
