/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import App, { routesConfig } from '../App';

describe('initial app rendering and navigation', () => {
  test('app should render homepage at start', () => {
    render(<App />);
    expect(screen.getByText(/axolotl beats/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login with spotify/i })).toBeInTheDocument();
  });
  // TODO: test below should be revised to ensure that access to routes is blocked if not auth'ed
  test('direct access to available route should render', () => {
    const router = createMemoryRouter(routesConfig, {
      initialEntries: ['/form'],
    });
    render(<RouterProvider router={router} />);
    expect(screen.getByText(/user input form/i)).toBeInTheDocument();
  });
});
