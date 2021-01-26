const isFalsy = require('./is-falsy');

it('should return true given false', () => {
  const result = isFalsy(false);
  expect(result).toBe(true);
});

it('should return false given true', () => {
  const result = isFalsy(true);
  expect(result).toBe(false);
});

