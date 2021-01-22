/**
 * @callback Validator
 * @param {*} value
 * @returns {boolean}
 */

/**
 * @param {*} val
 * @param {Validator} validator
 * @param {string} errorMessage
 * @returns {string|undefined}
 */
function validate(val, validator, errorMessage) {
  const isValid = validator(val);
  return isValid
    ? undefined
    : errorMessage;
}

module.exports = validate;