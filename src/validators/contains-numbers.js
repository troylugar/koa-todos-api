/**
 * @param {string} text 
 * @returns {boolean}
 */
function containsNumbers(text) {
  return text.match && text.match(/\d/);
}

module.exports = containsNumbers;
