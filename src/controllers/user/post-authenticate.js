const { userService } = require('../../services');
const AuthenticationError = require('../../errors/authentication.error');

async function authenticate({ request }) {
  try {
    const { username, password } = request.body;
    const token = await userService.authenticate(username, password);
    return {
      status: 200,
      body: { token }
    };
  } catch (err) {
    if (err instanceof AuthenticationError) {
      return { status: 401, body: err };
    } else {
      throw err;
    }
  }
}

module.exports = authenticate;
