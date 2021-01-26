/**
 * @param {string} text 
 * @returns {boolean}
 */
function containsSpecialChars(text) {
  return text.match && text.match(/\W/);
}

module.exports = containsSpecialChars;