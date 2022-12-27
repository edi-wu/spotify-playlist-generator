import httpMocks from 'node-mocks-http';
import playlistController from '../../controllers/playlistController';
import spotifyApi from '../../utils/apiWrapper';
import { generateRandomString } from '../../utils/helpers';
import { ERROR_MESSAGES, ONE_MIN_IN_MS } from '../../constants';

const response = httpMocks.createResponse();
const next = jest.fn();
const mockAccessToken = 'access-token';
const mockRefreshToken = 'refresh-token';

// clear response.locals object before each test to avoid properties persisting
beforeEach(() => {
  response.locals = {};
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('testing playlist creation middleware', () => {
  const request = httpMocks.createRequest({
    method: 'POST',
    url: '/generatePlaylist',
    cookies: { access: mockAccessToken, refresh: mockRefreshToken },
    body: {
      title: 'my playlist',
      description: 'playlist description',
      durationHours: '1',
      durationMinutes: '30',
      genres: 'classical',
    },
  });

  test('middleware should add playlist ID onto res.locals', async () => {
    spotifyApi.createPlaylist = jest.fn().mockResolvedValueOnce({ body: { id: 'my-playlist-id' } });
    await playlistController.createPlaylist(request, response, next);
    expect(response.locals).toHaveProperty('playlistId');
    expect(response.locals.playlistId).toBe('my-playlist-id');
    expect(next).toHaveBeenCalled();
  });

  test('middleware should throw error if API responds with error', async () => {
    spotifyApi.createPlaylist = jest.fn().mockRejectedValueOnce({
      statusCode: 417,
      body: { error: { status: 417, message: 'unable to create playlist' } },
      headers: { test: 'test' },
    });
    await playlistController.createPlaylist(request, response, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        log: 'unable to create playlist',
        status: 417,
        message: expect.objectContaining({
          err: `${ERROR_MESSAGES.playlistCreationFailed.response}`,
        }),
      })
    );
  });
});

describe('testing middleware to get recommended tracks', () => {
  const request = httpMocks.createRequest({
    method: 'POST',
    url: '/generatePlaylist',
    cookies: { access: mockAccessToken, refresh: mockRefreshToken },
    body: {
      title: 'my playlist',
      description: 'playlist description',
      durationHours: '',
      durationMinutes: '5',
      genres: 'classical',
    },
  });

  test('middleware should call API with correct options object', async () => {
    spotifyApi.getRecommendations = jest.fn();
    await playlistController.getRecommendations(request, response, next);
    expect(spotifyApi.getRecommendations).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 1,
        max_duration_ms: 300000,
        seed_genres: ['classical'],
      })
    );
  });

  test('middleware should no longer call API once requested playlist length is met', async () => {
    spotifyApi.getRecommendations = jest.fn().mockImplementation(() => {
      const mockUri: string = generateRandomString(8);
      const mockDuration: number = ONE_MIN_IN_MS;
      return {
        body: {
          tracks: [
            {
              duration_ms: mockDuration,
              uri: mockUri,
            },
          ],
        },
      };
    });
    await playlistController.getRecommendations(request, response, next);
    expect(spotifyApi.getRecommendations).toHaveBeenCalledTimes(5);
    expect(response.locals).toHaveProperty('tracks');
    expect(response.locals.tracks.length).toBe(5);
    expect(next).toHaveBeenCalled();
  });

  test('middleware should add a list of track URI onto res.locals', async () => {
    const mockTracks: string[] = [];
    spotifyApi.getRecommendations = jest.fn().mockImplementation(() => {
      const mockUri: string = generateRandomString(8);
      const mockDuration: number = Math.ceil(Math.random() * ONE_MIN_IN_MS + ONE_MIN_IN_MS);
      mockTracks.push(mockUri);
      return {
        body: {
          tracks: [
            {
              duration_ms: mockDuration,
              uri: mockUri,
            },
          ],
        },
      };
    });
    await playlistController.getRecommendations(request, response, next);
    expect(response.locals).toHaveProperty('tracks');
    expect(response.locals.tracks).toEqual(mockTracks);
    expect(next).toHaveBeenCalled();
  });

  test('middleware should throw error if API returns no tracks', async () => {
    spotifyApi.getRecommendations = jest.fn().mockImplementation(() => ({
      body: {
        tracks: [],
      },
    }));
    await playlistController.getRecommendations(request, response, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        log: `${ERROR_MESSAGES.trackGenerationFailed.log}`,
        status: 400,
        message: expect.objectContaining({
          err: `${ERROR_MESSAGES.trackGenerationFailed.response}`,
        }),
      })
    );
  });

  test('middleware should throw error if API responds with error', async () => {
    spotifyApi.getRecommendations = jest.fn().mockRejectedValueOnce({
      statusCode: 417,
      body: { error: { status: 417, message: 'unable to get recommendations' } },
      headers: { test: 'test' },
    });
    await playlistController.getRecommendations(request, response, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        log: 'unable to get recommendations',
        status: 417,
        message: expect.objectContaining({
          err: `${ERROR_MESSAGES.trackGenerationFailed.response}`,
        }),
      })
    );
  });
});

describe('testing middleware to add tracks onto playlist', () => {
  const request = httpMocks.createRequest({
    method: 'POST',
    url: '/generatePlaylist',
    cookies: { access: mockAccessToken, refresh: mockRefreshToken },
    body: {
      title: 'my playlist',
      description: 'playlist description',
      durationHours: '',
      durationMinutes: '5',
      genres: 'classical',
    },
  });
  response.locals.playlistId = generateRandomString(16);
  response.locals.tracks = [generateRandomString(8), generateRandomString(8)];

  test('middleware should add tracks onto provided playlist', async () => {
    spotifyApi.addTracksToPlaylist = jest.fn();
    await playlistController.addTracks(request, response, next);
    expect(spotifyApi.addTracksToPlaylist).toHaveBeenNthCalledWith(
      1,
      response.locals.playlistId,
      response.locals.tracks
    );
    expect(next).toHaveBeenCalled();
  });

  test('middleware should throw error if API responds with error', async () => {
    spotifyApi.addTracksToPlaylist = jest.fn().mockRejectedValueOnce({
      statusCode: 417,
      body: { error: { status: 417, message: 'unable to add tracks' } },
      headers: { test: 'test' },
    });
    await playlistController.addTracks(request, response, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        log: 'unable to add tracks',
        status: 417,
        message: expect.objectContaining({
          err: `${ERROR_MESSAGES.trackAdditionFailed.response}`,
        }),
      })
    );
  });
});

describe('testing middleware to return playlistId as response', () => {
  const request = httpMocks.createRequest({
    method: 'POST',
    url: '/generatePlaylist',
    cookies: { access: mockAccessToken, refresh: mockRefreshToken },
    body: {
      title: 'my playlist',
      description: 'playlist description',
      durationHours: '',
      durationMinutes: '5',
      genres: 'classical',
    },
  });

  test('middleware should return playlist ID as response', () => {
    const mockPlaylistId = generateRandomString(16);
    response.locals.playlistId = mockPlaylistId;
    response.json = jest.fn();
    playlistController.returnPlaylist(request, response, next);
    expect(response.statusCode).toBe(200);
    expect(response.json).toHaveBeenCalledWith(mockPlaylistId);
  });
});
