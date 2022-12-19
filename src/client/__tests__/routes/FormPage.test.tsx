/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import FormPage from '../routes/FormPage';

// TODO: test validation of numerical inputs when user types
// TODO: also unit test all the reusable components
// TODO: later, test calling api from user input and click
// TODO: look into setup/teardown for FE to avoid contamination

describe('input form rendering and navigation', () => {
  beforeEach(() => {
    render(<FormPage />, { wrapper: BrowserRouter });
  });

  test('page should display title and playlist generation button', () => {
    expect(screen.getByText(/user input form/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate my playlist/i })).toBeInTheDocument();
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  test('page should display input form with all fields', () => {
    expect(screen.getByLabelText('title')).toBeInTheDocument();
    expect(screen.getByLabelText('description')).toBeInTheDocument();
    expect(screen.getByLabelText('playlist length')).toBeInTheDocument();
    const fields = screen.getAllByRole('textbox');
    expect(fields.length).toBe(4);
    expect(screen.getByRole('combobox', { name: /genres/i })).toBeInTheDocument();
  });

  test('submit button should redirect to web player', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText(/generate my playlist/i));
    expect(window.location.pathname).toBe('/player');
  });
});
