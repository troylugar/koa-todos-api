const validateMultiple = require('./validate-multiple');

it('should throw error for given args', () => {
  const errors = ['error', 'other error'];
  expect(() => validateMultiple(...errors, undefined)).toThrowError(JSON.stringify(errors));
});

it('should not throw error for undefined args', () => {
  expect(() => validateMultiple(undefined)).not.toThrowError();
});