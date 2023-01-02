/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
// import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import App from '../App';

describe('initial app rendering and navigation', () => {
  test('app should render homepage at start', () => {
    render(<App />);
    expect(screen.getByText(/axolotl beats/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login with spotify/i })).toBeInTheDocument();
  });
  // TODO: test that direct access to routes is blocked if not auth'ed
});
