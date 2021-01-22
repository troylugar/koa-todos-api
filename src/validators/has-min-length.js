/**
 * @callback Validator
 * @param {*} val
 * @returns {boolean}
 */

/**
 * @param {*} length 
 * @returns {Validator}
 */
function hasMinLength(length) {
  return val => val && val.length >= length;
}

module.exports = hasMinLength;