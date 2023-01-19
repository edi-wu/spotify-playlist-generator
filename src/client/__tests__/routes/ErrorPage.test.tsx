/**
 * @jest-environment jsdom
 */
import { screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import ErrorPage from '../../routes/ErrorPage';
import setup from '../../utils/testSetup';

describe('error page rendering and navigation', () => {
  test('page should display error message and "return home" button', () => {
    setup(<ErrorPage />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /return home/i })).toBeInTheDocument();
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  test('"return home" button should redirect to homepage', async () => {
    const { user } = setup(<ErrorPage />, { withUser: true });
    await user?.click(screen.getByText(/return home/i));
    expect(window.location.pathname).toBe('/');
  });
});
