const validate = require('./validate');

const value = 'asdf';
const errorMessage = 'this is error message';

it('should return undefined upon successfully validating the value given', () => {
  const validator = jest.fn(() => true);
  const result = validate(value, validator, errorMessage);
  expect(result).toBeUndefined();
});

it('should return error message upon unsuccessfully validating the value given', () => {
  const validator = jest.fn(() => false);
  const result = validate(value, validator, errorMessage);
  expect(result).toBe(errorMessage);
});