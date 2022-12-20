/**
 * @jest-environment jsdom
 */

import { screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import setup from '../setup';
import FormPage from '../../routes/FormPage';
import SPOTIFY_GENRE_SEEDS from '../../constants';

// TODO: later, test calling api from user input and click
// TODO: look into setup/teardown for FE to avoid contamination

describe('testing input form rendering', () => {
  test('page should display title and playlist generation button', () => {
    setup(<FormPage />);
    expect(screen.getByText(/user input form/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate my playlist/i })).toBeInTheDocument();
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  test('page should display input form with all fields', () => {
    setup(<FormPage />);
    expect(screen.getByLabelText('title')).toBeInTheDocument();
    expect(screen.getByLabelText('description')).toBeInTheDocument();
    expect(screen.getByLabelText('hour(s)')).toBeInTheDocument();
    expect(screen.getByLabelText('minutes')).toBeInTheDocument();
    const fields = screen.getAllByRole('textbox');
    expect(fields.length).toBe(4);
    expect(screen.getByRole('combobox', { name: /genres/i })).toBeInTheDocument();
  });

  test('dropdown menu should contain options for every Spotify genre seed', () => {
    setup(<FormPage />);
    const genreOptions = screen.getAllByTestId('menuOption');
    expect(genreOptions.length).toBe(SPOTIFY_GENRE_SEEDS.length);
  });
});

describe('testing input form interactivity', () => {
  describe('invalid playlist duration should trigger alert to display', () => {
    test('alert should display for invalid hours', async () => {
      const { user } = setup(<FormPage />, { withUser: true });
      const textbox = screen.getByLabelText('hour(s)');
      await user?.type(textbox, 'eleven');
      expect(screen.getByTestId('alertMessage')).toBeInTheDocument();
      expect(
        screen.getByText('Please input positive integers for playlist duration')
      ).toBeInTheDocument();
    });
    test('alert should display for invalid minutes', async () => {
      const { user } = setup(<FormPage />, { withUser: true });
      const textbox = screen.getByLabelText('minutes');
      await user?.type(textbox, 'eleven');
      expect(screen.getByTestId('alertMessage')).toBeInTheDocument();
      expect(
        screen.getByText('Please input positive integers for playlist duration')
      ).toBeInTheDocument();
    });
  });
  test('submit button should redirect to web player', async () => {
    const { user } = setup(<FormPage />, { withUser: true });
    await user?.click(screen.getByText(/generate my playlist/i));
    expect(window.location.pathname).toBe('/player');
  });
});
