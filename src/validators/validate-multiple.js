function validateMultiple() {
  const errors = [...arguments].filter(e => e !== undefined);

  if (errors.length > 0) {
    throw new Error(JSON.stringify(errors));
  }
}

module.exports = validateMultiple;