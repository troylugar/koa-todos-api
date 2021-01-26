function userModelWrapper({ uuid, now, validators }) {
  const { validateMultiple, validate, isString, hasMinLength } = validators;
  return function userModel({
    id = uuid(),
    username,
    password,
    roles = [],
    createdAt = now(),
    updatedAt = now()
  } = {}) {
    validateMultiple(
      validate(username, isString, 'username must be a string'),
      validate(username, hasMinLength(3), 'username must have length >= 3')
    );
    
    return {
      id,
      username,
      password,
      roles,
      createdAt,
      updatedAt
    };
  };
}

module.exports = userModelWrapper;