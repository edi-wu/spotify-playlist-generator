import { generateRandomString, isApiErrorResponse } from '../utils/helpers';

describe('testing random string generator', () => {
  test('function should return string of specified length', () => {
    const randomStr: string = generateRandomString(16);
    expect(randomStr.length).toBe(16);
  });

  test('function should generate distinct random strings', () => {
    const str1: string = generateRandomString(16);
    const str2: string = generateRandomString(16);
    expect(str1).not.toBe(str2);
    const str3: string = generateRandomString(16);
    expect(str1).not.toBe(str3);
    expect(str2).not.toBe(str3);
  });
});

describe('testing type guard for API response error', () => {
  test('function should return true for API response error object', () => {
    const err = {
      statusCode: 500,
      body: { error: { status: 500, message: 'error' } },
      headers: { test: 'test' },
    };
    expect(isApiErrorResponse(err)).toBe(true);
  });

  test('function should return false for other (error) objects', () => {
    const otherOne = { statusCode: 500, message: 'error' };
    expect(isApiErrorResponse(otherOne)).toBe(false);

    const otherTwo = { body: { error: { status: 500, message: 'error' } } };
    expect(isApiErrorResponse(otherTwo)).toBe(false);
  });
});
