const containsNumbers = require('./contains-numbers');

it('should return false given a string without numbers', () => {
  const result = containsNumbers('abcdefg');
  expect(result).toBeFalsy();
});

it('should return true given a string with numbers', () => {
  const result = containsNumbers('hell0 w0rld');
  expect(result).toBeTruthy();
});
