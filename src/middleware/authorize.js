const verifyToken = require('../utilities/verify-token');
const AuthenticationError = require('../errors/authentication.error');

function getTokenFromHeaders(headers) {
  const header = headers.auth;
  const token = header && header.split('Bearer ')[1];
  if (!token) {
    throw new AuthenticationError('No token provided');
  }
  return token;
}

async function auth(ctx, next) {
  try {
    const token = getTokenFromHeaders(ctx.request.headers);
    ctx.token = verifyToken(token);
    await next(ctx);
  } catch (err) {
    if (err instanceof AuthenticationError) {
      ctx.body = err;
      ctx.status = 401;
    } else {
      throw err;
    }
  }
}

module.exports = auth;
