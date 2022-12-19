/**
 * @jest-environment jsdom
 */
// TODO: test rendering title + button
// TODO: test button redirects to oauth (currently placeholder)

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Homepage from '../routes/Homepage';

describe('homepage rendering and navigation', () => {
  beforeEach(() => {
    render(<Homepage />, { wrapper: BrowserRouter });
  });

  test('page should display title and login button', () => {
    expect(screen.getByText(/axolotl beats/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /login with spotify/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  test('login button should redirect to oauth placeholder', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText(/login with spotify/i));
    expect(window.location.pathname).toBe('/oauth');
  });
});
