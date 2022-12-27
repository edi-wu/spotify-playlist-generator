import { generateRandomString, getErrorDetails } from '../utils/helpers';
import ERROR_MESSAGES from '../constants';

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

describe('testing function to extract error status and log', () => {
  test('function should return default status and log if input does not pass type guard', () => {
    const err1 = { statusCode: 500, message: 'error' };
    expect(getErrorDetails(err1)).toEqual([ERROR_MESSAGES.defaultError.log, 500]);
    const err2 = { body: { error: { status: 500, message: 'error' } } };
    expect(getErrorDetails(err2)).toEqual([ERROR_MESSAGES.defaultError.log, 500]);
  });

  test('function should extract status and log from valid error object', () => {
    const err = {
      statusCode: 417,
      body: { error: { status: 417, message: 'api error response' } },
      headers: { test: 'test' },
    };
    expect(getErrorDetails(err)).toEqual(['api error response', 417]);
  });
});
