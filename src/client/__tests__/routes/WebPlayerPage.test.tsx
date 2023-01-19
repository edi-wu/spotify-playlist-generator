/**
 * @jest-environment jsdom
 */

import { screen, render, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import WebPlayerPage from '../../routes/WebPlayerPage';

afterEach(() => {
  jest.clearAllMocks();
});

describe('testing form rendering', () => {
  test('page should append web player script and define SDK callback on load', async () => {
    const initialEntries = [
      {
        pathname: '/player',
        state: { playlistId: 'test-playlist-id', playlistTitle: 'test-playlist-title' },
      },
    ];
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <WebPlayerPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      const scripts = document.body.getElementsByTagName('script');
      expect(scripts).toHaveLength(1);
      expect(scripts[0]).toHaveProperty('src', 'https://sdk.scdn.co/spotify-player.js');
      expect(scripts[0]).toHaveProperty('async', true);
    });
    await waitFor(() => expect(window.onSpotifyWebPlaybackSDKReady).toBeDefined());
  });

  test('page should render generated playlist title', async () => {
    const initialEntries = [
      {
        pathname: '/player',
        state: { playlistId: 'test-playlist-id', playlistTitle: 'test-playlist-title' },
      },
    ];
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <WebPlayerPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/test-playlist-title/)).toBeInTheDocument();
    });
  });
});
