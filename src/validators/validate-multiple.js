const ValidationError = require('../errors/validation.error');

function validateMultiple() {
  const errors = [...arguments].filter(e => e !== undefined);

  if (errors.length > 0) {
    throw new ValidationError(JSON.stringify(errors));
  }
}

module.exports = validateMultiple;