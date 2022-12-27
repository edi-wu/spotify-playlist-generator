import httpMocks from 'node-mocks-http';
import playlistController from '../../controllers/playlistController';
import spotifyApi from '../../utils/apiWrapper';
import ERROR_MESSAGES from '../../constants';

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
      body: { error: { status: 417, message: 'api error response' } },
      headers: { test: 'test' },
    });
    await playlistController.createPlaylist(request, response, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        log: 'api error response',
        status: 417,
        message: expect.objectContaining({
          err: `${ERROR_MESSAGES.playlistCreationFailed.response}`,
        }),
      })
    );
  });
});
