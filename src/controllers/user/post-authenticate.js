const AuthenticationError = require('../../errors/authentication.error');

function authenticateWrapper({ userService }) {
  return async function authenticate({ request }) {
    try {
      const { username, password } = request.body;
      const token = await userService.authenticate(username, password);
      return {
        status: 200,
        body: { token }
      };
    } catch (err) {
      if (err instanceof AuthenticationError) {
        return { status: 401, body: err.message };
      } else {
        throw err;
      }
    }
  };
}

module.exports = authenticateWrapper;
