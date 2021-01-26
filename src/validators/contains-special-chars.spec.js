const containsSpecialChars = require('./contains-special-chars');

it('should return false given string without special characters', () => {
  const result = containsSpecialChars('NoSpecialCharsHere');
  expect(result).toBeFalsy();
});

it('should return true given string with special characters', () => {
  const result = containsSpecialChars('howdy!');
  expect(result).toBeTruthy();
});

it('numbers are not special characters', () => {
  const result = containsSpecialChars('h0wdy');
  expect(result).toBeFalsy();
});
