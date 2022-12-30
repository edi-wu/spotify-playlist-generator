/**
 * @jest-environment jsdom
 */

import { screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import setup from '../../utils/testSetup';
import FormPage from '../../routes/FormPage';
import * as playlistService from '../../services/playlistService';
import { SPOTIFY_GENRE_SEEDS, ERROR_MESSAGES } from '../../constants';

afterEach(() => {
  jest.clearAllMocks();
});

describe('testing form rendering', () => {
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
    expect(screen.getAllByRole('textbox').length).toBe(4);
    expect(screen.getByRole('combobox', { name: /genres/i })).toBeInTheDocument();
  });

  test('dropdown menu should contain options for every Spotify genre seed', () => {
    setup(<FormPage />);
    const genreOptions = screen.getAllByTestId('menuOption');
    expect(genreOptions.length).toBe(SPOTIFY_GENRE_SEEDS.length);
  });

  test('page should render user input', async () => {
    const { user } = setup(<FormPage />, { withUser: true });

    await user?.type(screen.getByLabelText('title'), 'my playlist');
    await user?.type(screen.getByLabelText('description'), 'a very good playlist');
    await user?.type(screen.getByLabelText('hour(s)'), 'eleven');
    await user?.type(screen.getByLabelText('minutes'), '11');
    await user?.selectOptions(screen.getByLabelText('genres'), SPOTIFY_GENRE_SEEDS[0]);
    expect(screen.getByDisplayValue('my playlist')).toBeInTheDocument();
    expect(screen.getByDisplayValue('a very good playlist')).toBeInTheDocument();
    expect(screen.getByDisplayValue('eleven')).toBeInTheDocument();
    expect(screen.getByDisplayValue('11')).toBeInTheDocument();
    expect(
      (screen.getByText(`${SPOTIFY_GENRE_SEEDS[0]}`) as HTMLOptionElement).selected
    ).toBeTruthy();
  });
});

describe('testing form validation and submission', () => {
  test('no alerts should display on initial render', () => {
    setup(<FormPage />);
    expect(screen.queryByTestId('alertMessage')).toBe(null);
  });

  describe('testing invalid playlist duration alert', () => {
    test('alert should display for invalid hours', async () => {
      const { user } = setup(<FormPage />, { withUser: true });

      await user?.type(screen.getByLabelText('hour(s)'), 'eleven');
      expect(screen.getByTestId('alertMessage')).toBeInTheDocument();
      expect(screen.getByText(`${ERROR_MESSAGES.invalidDuration}`)).toBeInTheDocument();
    });

    test('alert should display for invalid minutes', async () => {
      const { user } = setup(<FormPage />, { withUser: true });

      await user?.type(screen.getByLabelText('minutes'), 'eleven');
      expect(screen.getByTestId('alertMessage')).toBeInTheDocument();
      expect(screen.getByText(`${ERROR_MESSAGES.invalidDuration}`)).toBeInTheDocument();
    });

    test('hours and minutes should be validated indepedently', async () => {
      const { user } = setup(<FormPage />, { withUser: true });

      await user?.type(screen.getByLabelText('hour(s)'), 'eleven');
      expect(screen.getByTestId('alertMessage')).toBeInTheDocument();
      expect(screen.getByText(`${ERROR_MESSAGES.invalidDuration}`)).toBeInTheDocument();

      await user?.type(screen.getByLabelText('minutes'), '11');
      expect(screen.getByTestId('alertMessage')).toBeInTheDocument();
      expect(screen.getByText(`${ERROR_MESSAGES.invalidDuration}`)).toBeInTheDocument();
    });

    test('alert should disappear when user clears invalid input', async () => {
      const { user } = setup(<FormPage />, { withUser: true });
      const textbox = screen.getByLabelText('hour(s)');

      await user?.type(textbox, 'eleven');
      expect(screen.getByTestId('alertMessage')).toBeInTheDocument();
      expect(screen.getByText(`${ERROR_MESSAGES.invalidDuration}`)).toBeInTheDocument();

      await user?.clear(textbox);
      expect(screen.queryByTestId('alertMessage')).toBe(null);
    });
  });
  describe('testing missing playlist duration alert on submit', () => {
    test('alert should display if both input fields are empty', async () => {
      const { user } = setup(<FormPage />, { withUser: true });

      await user?.selectOptions(screen.getByLabelText('genres'), SPOTIFY_GENRE_SEEDS[0]);
      await user?.click(screen.getByText(/generate my playlist/i));
      expect(screen.getByTestId('alertMessage')).toBeInTheDocument();
      expect(screen.getByText(`${ERROR_MESSAGES.missingDuration}`)).toBeInTheDocument();
    });

    test('alert should display if input fields only contain 0', async () => {
      const { user } = setup(<FormPage />, { withUser: true });

      await user?.selectOptions(screen.getByLabelText('genres'), SPOTIFY_GENRE_SEEDS[0]);
      await user?.type(screen.getByLabelText('hour(s)'), '0');
      await user?.click(screen.getByText(/generate my playlist/i));
      expect(screen.getByTestId('alertMessage')).toBeInTheDocument();
      expect(screen.getByText(`${ERROR_MESSAGES.missingDuration}`)).toBeInTheDocument();

      await user?.type(screen.getByLabelText('minutes'), '0');
      await user?.click(screen.getByText(/generate my playlist/i));
      expect(screen.getByTestId('alertMessage')).toBeInTheDocument();
      expect(screen.getByText(`${ERROR_MESSAGES.missingDuration}`)).toBeInTheDocument();
    });

    test('both input error alerts should display in case of invalid input', async () => {
      const { user } = setup(<FormPage />, { withUser: true });

      await user?.selectOptions(screen.getByLabelText('genres'), SPOTIFY_GENRE_SEEDS[0]);
      await user?.type(screen.getByLabelText('hour(s)'), 'eleven');
      await user?.click(screen.getByText(/generate my playlist/i));
      expect(screen.getAllByTestId('alertMessage').length).toBe(2);
      expect(screen.getByText(`${ERROR_MESSAGES.invalidDuration}`)).toBeInTheDocument();
      expect(screen.getByText(`${ERROR_MESSAGES.missingDuration}`)).toBeInTheDocument();
    });

    test('alert should not display for valid inputs', async () => {
      const { user } = setup(<FormPage />, { withUser: true });

      await user?.type(screen.getByLabelText('hour(s)'), '1');
      await user?.click(screen.getByText(/generate my playlist/i));
      expect(screen.queryByText(`${ERROR_MESSAGES.missingDuration}`)).toBe(null);

      await user?.type(screen.getByLabelText('minutes'), '1');
      await user?.click(screen.getByText(/generate my playlist/i));
      expect(screen.queryByText(`${ERROR_MESSAGES.missingDuration}`)).toBe(null);
    });
  });
  describe('testing missing genre selection alert on submit', () => {
    test('alert should display if no genre is selected', async () => {
      const { user } = setup(<FormPage />, { withUser: true });

      await user?.type(screen.getByLabelText('minutes'), '10');
      await user?.click(screen.getByText(/generate my playlist/i));
      expect(screen.getByTestId('alertMessage')).toBeInTheDocument();
      expect(screen.getByText(`${ERROR_MESSAGES.missingGenre}`)).toBeInTheDocument();
    });

    test('alert should not display if a genre is selected', async () => {
      const { user } = setup(<FormPage />, { withUser: true });

      await user?.selectOptions(screen.getByLabelText('genres'), SPOTIFY_GENRE_SEEDS[0]);
      await user?.click(screen.getByText(/generate my playlist/i));
      expect(screen.queryByText(`${ERROR_MESSAGES.missingGenre}`)).toBe(null);
    });
  });

  test('submission handler should not make api request if any required input is missing or invalid', async () => {
    const { user } = setup(<FormPage />, { withUser: true });
    const generatePlaylist = jest.spyOn(playlistService, 'generatePlaylist');

    await user?.click(screen.getByText(/generate my playlist/i));
    expect(generatePlaylist).not.toHaveBeenCalled();

    await user?.type(screen.getByLabelText('minutes'), '10');
    await user?.click(screen.getByText(/generate my playlist/i));
    expect(generatePlaylist).not.toHaveBeenCalled();

    await user?.clear(screen.getByLabelText('minutes'));
    await user?.selectOptions(screen.getByLabelText('genres'), SPOTIFY_GENRE_SEEDS[0]);
    await user?.click(screen.getByText(/generate my playlist/i));
    expect(generatePlaylist).not.toHaveBeenCalled();
  });

  test('if input is valid, submission should make api call', async () => {
    const { user } = setup(<FormPage />, { withUser: true });
    const generatePlaylist = jest.spyOn(playlistService, 'generatePlaylist');
    generatePlaylist.mockResolvedValue('made api call');

    await user?.type(screen.getByLabelText('title'), 'my playlist');
    await user?.type(screen.getByLabelText('description'), 'a very good playlist');
    await user?.type(screen.getByLabelText('minutes'), '10');
    await user?.selectOptions(screen.getByLabelText('genres'), SPOTIFY_GENRE_SEEDS[0]);
    await user?.click(screen.getByText(/generate my playlist/i));
    expect(screen.queryByTestId('alertMessage')).toBe(null);
    expect(generatePlaylist).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.any(String),
        description: expect.any(String),
        durationHours: expect.any(String),
        durationMinutes: expect.any(String),
        genres: expect.any(String),
      })
    );
  });
});

describe('testing form redirect after submission', () => {
  test('form should redirect to player upon request success', async () => {
    const { user } = setup(<FormPage />, { withUser: true });
    const generatePlaylist = jest.spyOn(playlistService, 'generatePlaylist');
    generatePlaylist.mockResolvedValue('test-playlist-id');

    await user?.type(screen.getByLabelText('minutes'), '10');
    await user?.selectOptions(screen.getByLabelText('genres'), SPOTIFY_GENRE_SEEDS[0]);
    await user?.click(screen.getByText(/generate my playlist/i));
    expect(screen.queryByTestId('alertMessage')).toBe(null);
    expect(generatePlaylist).toHaveBeenCalled();
    expect(window.location.pathname).toBe('/player');
  });

  test('form should redirect to error page upon request failure', async () => {
    const { user } = setup(<FormPage />, { withUser: true });
    const generatePlaylist = jest.spyOn(playlistService, 'generatePlaylist');
    generatePlaylist.mockResolvedValue(new Error('test-server-error'));

    await user?.type(screen.getByLabelText('minutes'), '10');
    await user?.selectOptions(screen.getByLabelText('genres'), SPOTIFY_GENRE_SEEDS[0]);
    await user?.click(screen.getByText(/generate my playlist/i));
    expect(screen.queryByTestId('alertMessage')).toBe(null);
    expect(generatePlaylist).toHaveBeenCalled();
    expect(window.location.pathname).toBe('/error');
  });
});
