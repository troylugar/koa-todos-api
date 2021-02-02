const { userService } = require('../../services');
const ValidationError = require('../../errors/validation.error');

async function register({ request }) {
  try {
    const { username, password } = request.body;
    await userService.register({ username, password });
    return { status: 201 };
  } catch (err) {
    if (err instanceof ValidationError) {
      return { status: 400, body: err.message };
    } else {
      throw err;
    }
  }
}

module.exports = register;
