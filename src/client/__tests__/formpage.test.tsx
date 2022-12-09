/**
 * @jest-environment jsdom
 */
// TODO: test button redirects to web player page;
// TODO LATER: submitting form triggers loading page/animation and api call

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import FormPage from '../routes/FormPage';

describe('input form rendering and navigation', () => {
  beforeEach(() => {
    render(<FormPage />, { wrapper: BrowserRouter });
  });

  test('page should display title and login button', () => {
    expect(screen.getByText(/user input form/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /redirect to player/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  test('submit button should redirect to web player', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText(/redirect to player/i));
    expect(window.location.pathname).toBe('/player');
  });
});
