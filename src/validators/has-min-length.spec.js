const hasMinLength = require('./has-min-length');

describe('falsy functionality', () => {
  it('should return false when given undefined', () => {
    const result = hasMinLength(5)(undefined);
    expect(result).toBeFalsy();
  });

  it('should return false when given null', () => {
    const result = hasMinLength(5)(null);
    expect(result).toBeFalsy();
  });
});

describe('string functionality', () => {
  it('should return false when string length is less than minimum', () => {
    const result = hasMinLength(6)('hello');
    expect(result).toBeFalsy();
  });

  it('should return true when string length is same as minimum', () => {
    const result = hasMinLength(5)('hello');
    expect(result).toBeTruthy();
  });

  it('should return true when string length greater than minimum', () => {
    const result = hasMinLength(4)('hello');
    expect(result).toBeTruthy();
  });
});

describe('array functionality', () => {
  it('should return false when array length is less than minimum', () => {
    const result = hasMinLength(6)([...'hello']);
    expect(result).toBeFalsy();
  });

  it('should return true when array length is same as minimum', () => {
    const result = hasMinLength(5)([...'hello']);
    expect(result).toBeTruthy();
  });

  it('should return true when array length greater than minimum', () => {
    const result = hasMinLength(4)([...'hello']);
    expect(result).toBeTruthy();
  });
});