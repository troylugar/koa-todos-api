const jwt = require('jsonwebtoken');
const config = require('../utilities/config');
const publicKey = config.auth_public_key;
const NOT_AUTHORIZED = { status: 401 };

function auth(ctx, next) {
  const header = ctx.request.headers.auth;
  if (!header) {
    return NOT_AUTHORIZED;
  }
  const token = header.split('Bearer ')[1];
  try {
    const decoded = jwt.verify(token, publicKey, { algorithm: 'RS256' });
    ctx.token = decoded;
    next(ctx);
  } catch (err) {
    return NOT_AUTHORIZED;
  }
}

module.exports = auth;
