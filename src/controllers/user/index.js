const postAuthenticate = require('./post-authenticate');
const postRegister = require('./post-register');

const routes = [
  { method: 'POST', path: '/auth', controller: postAuthenticate },
  { method: 'POST', path: '/register', controller: postRegister }
];

module.exports = routes;