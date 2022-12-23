/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom';
import setup from '../../utils/testSetup';
import OAuthRedirect from '../../routes/OAuthRedirect';
import { ENDPOINTS } from '../../constants';

describe('oauth component rendering and navigation', () => {
  test('page should not render any content', () => {
    const { container } = setup(<OAuthRedirect />);
    expect(container).toBeEmptyDOMElement();
  });

  test('page should update pathname to OAuth endpoint', () => {
    const mockReplace = jest.fn();
    Object.defineProperty(window, 'location', {
      value: {
        replace: mockReplace,
      },
      writable: true,
    });
    setup(<OAuthRedirect />);
    expect(mockReplace).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith(`${ENDPOINTS.oauth}`);
  });
});
