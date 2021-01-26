const userService = require('../../services/user');

const postAuthenticateWrapper = require('./post-authenticate');
const postAuthenticate = postAuthenticateWrapper({ userService });

const postRegisterWrapper = require('./post-register');
const postRegister = postRegisterWrapper({ userService });

const routes = [
  { method: 'POST', path: '/auth', controller: postAuthenticate },
  { method: 'POST', path: '/register', controller: postRegister }
];

module.exports = routes;