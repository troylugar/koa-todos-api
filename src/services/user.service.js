const { User } = require('../models');
const AuthenticationError = require('../errors/authentication.error');
const generateToken = require('../utilities/generate-token');
const comparePassword = require('../utilities/compare-password');
const hashPassword = require('../utilities/hash-password');
const {
  validateMultiple,
  validate,
  isString,
  hasMinLength,
  containsSpecialChars,
  containsNumbers,
  isFalsy
} = require('../validators');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async authenticate(username, password) {
    const user = await this.userRepository.findByUsername(username);
    if (!user || !(await comparePassword(password, user.password))) {
      throw new AuthenticationError('username/password mismatch');
    }
    return generateToken({
      uid: user.id,
      roles: user.roles
    });
  }

  async register(userData) {
    const { username, password } = userData;
    const user = await this.userRepository.findByUsername(username);
    validateMultiple(
      validate(user, isFalsy, 'username is already being used'),
      validate(password, isString, 'password must be a string'),
      validate(password, hasMinLength(8), 'password must have length >= 8'),
      validate(password, containsSpecialChars, 'password must contain at least 1 special character'),
      validate(password, containsNumbers, 'password must contain at least 1 number')
    );
    const hashedPassword = await hashPassword(password);
    const model = new User({
      ...userData,
      password: hashedPassword
    });
    return await this.userRepository.insert(model);
  }
}

module.exports = UserService;
