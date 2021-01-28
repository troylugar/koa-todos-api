const UserModel = require('../../models/user');

function registerUserWrapper({ userRepository, hashPassword, validators }) {
  const {
    validateMultiple,
    validate,
    isString,
    hasMinLength,
    containsSpecialChars,
    containsNumbers,
    isFalsy
  } = validators;
  return async function registerUser(data) {
    const { username, password } = data;
    const user = await userRepository.findByUsername(username);
    validateMultiple(
      validate(user, isFalsy, 'username is already being used'),
      validate(password, isString, 'password must be a string'),
      validate(password, hasMinLength(8), 'password must have length >= 8'),
      validate(password, containsSpecialChars, 'password must contain at least 1 special character'),
      validate(password, containsNumbers, 'password must contain at least 1 number')
    );
    const hashedPassword = await hashPassword(password);
    const model = UserModel({
      ...data,
      password: hashedPassword
    });
    return await userRepository.insert(model);
  };
}

module.exports = registerUserWrapper;
