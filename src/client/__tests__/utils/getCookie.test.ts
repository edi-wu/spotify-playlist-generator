/**
 * @jest-environment jsdom
 */

import getCookie from '../../utils/getCookie';

describe('testing function to obtain browser cookies', () => {
  Object.defineProperty(window.document, 'cookie', {
    writable: true,
    value:
      'state=samplestate; access=sample-access-token; refresh=sample-refresh-token; misc=othercookie',
  });

  test('function should return value of existing cookie', () => {
    expect(getCookie('access')).toBe('sample-access-token');
    expect(getCookie('state')).toBe('samplestate');
  });
  test('function should return empty string if no cookie exists by that name', () => {
    expect(getCookie('playlist')).toBe('');
  });
});
