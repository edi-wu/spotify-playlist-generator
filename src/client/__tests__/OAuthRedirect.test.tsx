/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import OAuthRedirect from '../routes/OAuthRedirect';

describe('homepage rendering and navigation', () => {
  test('page should not render any content', () => {
    const { container } = render(<OAuthRedirect />, { wrapper: BrowserRouter });
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
    render(<OAuthRedirect />, { wrapper: BrowserRouter });
    expect(mockReplace).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('http://localhost:8080/api/login');
  });
});
