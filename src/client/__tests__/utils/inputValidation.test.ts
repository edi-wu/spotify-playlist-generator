import isPositiveInteger from '../../utils/inputValidation';

describe('testing function to validate numeric input', () => {
  test('function should return true for 0 and positive integers', () => {
    expect(isPositiveInteger('0')).toBe(true);
    expect(isPositiveInteger('123')).toBe(true);
  });
  test('function should return false for strings that contain non-digits', () => {
    expect(isPositiveInteger('19minutes')).toBe(false);
    expect(isPositiveInteger('eleven')).toBe(false);
    expect(isPositiveInteger('@')).toBe(false);
  });
  test('function should return false for negative numbers', () => {
    expect(isPositiveInteger('-12')).toBe(false);
    expect(isPositiveInteger('-15.5')).toBe(false);
  });
  test('function should return false for nonintegers', () => {
    expect(isPositiveInteger('12.5')).toBe(false);
  });
  test('function should return true for empty string', () => {
    expect(isPositiveInteger('')).toBe(true);
  });
});
