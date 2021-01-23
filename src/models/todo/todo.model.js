function todoWrapper({ uuid, now, validators }) {
  const { isString, hasMinLength, validate, validateMultiple } = validators;
  return function todo({
    id = uuid(),
    title,
    completed = false,
    createdAt = now(),
    updatedAt = now()
  } = {}) {
    validateMultiple(
      validate(title, isString, 'title must be a string'),
      validate(title, hasMinLength(3), 'title must have a length >= 3'),
    );

    return {
      id,
      title,
      completed,
      updatedAt,
      createdAt
    };
  };
}

module.exports = todoWrapper;
