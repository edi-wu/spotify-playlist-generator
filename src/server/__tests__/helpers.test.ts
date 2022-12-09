import generateRandomString from '../utils/helpers';

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
