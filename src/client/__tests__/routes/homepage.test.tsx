/**
 * @jest-environment jsdom
 */
// TODO: test rendering title + button
// TODO: test button redirects to oauth (currently placeholder)

import { screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import Homepage from '../../routes/Homepage';
import setup from '../../utils/testSetup';

describe('homepage rendering and navigation', () => {
  test('page should display title and login button', () => {
    setup(<Homepage />);
    expect(screen.getByText(/axolotl beats/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login with spotify/i })).toBeInTheDocument();
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  test('login button should redirect to oauth placeholder', async () => {
    const { user } = setup(<Homepage />, { withUser: true });
    await user?.click(screen.getByText(/login with spotify/i));
    expect(window.location.pathname).toBe('/oauth');
  });
});
