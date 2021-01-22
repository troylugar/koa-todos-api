const isString = require('./is-string');

it('should return true for strings', () => {
  const result = isString('test');
  expect(result).toBeTruthy();
});

it('should return true for spaces', () => {
  const result = isString(' ');
  expect(result).toBeTruthy();
});

it('should return true for tabs', () => {
  const result = isString('\t');
  expect(result).toBeTruthy();
});

it('should return true for new lines', () => {
  const result = isString('\n');
  expect(result).toBeTruthy();
});

it('should return true for an empty string', () => {
  const result = isString('');
  expect(result).toBeTruthy();
});

it('should return true for falsy strings', () => {
  const result = isString('undefined');
  expect(result).toBeTruthy();
});

it('should return false for numbers', () => {
  const result = isString(1234);
  expect(result).toBeFalsy();
});

it('should return false for objects', () => {
  const result = isString({});
  expect(result).toBeFalsy();
});

it('should return false for arrays', () => {
  const result = isString([]);
  expect(result).toBeFalsy();
});

it('should return false for functions', () => {
  const result = isString(() => {});
  expect(result).toBeFalsy();
});