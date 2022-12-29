import axios from 'axios';
import { generatePlaylist, playPlaylist } from '../../services/playlistService';
import { ENDPOINTS } from '../../constants';
import { FormData } from '../../types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

afterEach(() => {
  jest.clearAllMocks();
});

describe('testing playlist generation handler', () => {
  const url = ENDPOINTS.playlist;
  const input: FormData = {
    title: 'my playlist',
    description: 'many songs',
    durationHours: '1',
    durationMinutes: '',
    genres: 'classical',
  };

  test('successful request should return playlist id data', async () => {
    mockedAxios.post.mockResolvedValue({ data: 'test-playlist-id', status: 200 });

    const response = await generatePlaylist(input);
    expect(mockedAxios.post).toHaveBeenNthCalledWith(1, url, input);
    expect(response).toBe('test-playlist-id');
  });

  test('failed request should return error object', async () => {
    mockedAxios.post.mockRejectedValue(new Error('playlist generation error'));

    const response = await generatePlaylist(input);
    expect(mockedAxios.post).toHaveBeenNthCalledWith(1, url, input);
    expect(response instanceof Error).toBe(true);
    expect((response as Error).message).toBe('playlist generation error');
  });

  test('failed request with non-error return should be converted to error object', async () => {
    mockedAxios.post.mockRejectedValue(-1);
    const expectedError = new Error(String(-1));

    const response = await generatePlaylist(input);
    expect(mockedAxios.post).toHaveBeenNthCalledWith(1, url, input);
    expect(response instanceof Error).toBe(true);
    expect(response).toMatchObject(expectedError);
  });
});

describe('testing function to start playing selected playlist', () => {
  const mockDeviceId = 'my-device-123';
  const mockPlaylistUri = 'playlist-123';
  const mockToken = 'access-token';

  test('function should make put request with correct arguments', async () => {
    await playPlaylist(mockDeviceId, mockPlaylistUri, mockToken);
    expect(mockedAxios.put.mock.calls.length).toBe(1);
    expect(mockedAxios.put.mock.calls[0][0]).toMatch(mockDeviceId);
    expect(mockedAxios.put.mock.calls[0][1]).toEqual(
      expect.objectContaining({ context_uri: expect.stringContaining(mockPlaylistUri) })
    );
    expect(mockedAxios.put.mock.calls[0][2]).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: expect.stringContaining(mockToken) }),
      })
    );
  });

  test('function should console log error message', async () => {
    const logSpy = jest.spyOn(console, 'log');
    mockedAxios.put.mockRejectedValueOnce(new Error('playlist playback error'));
    await playPlaylist(mockDeviceId, mockPlaylistUri, mockToken);
    expect(logSpy.mock.calls.length).toBe(1);
    expect(logSpy.mock.calls[0][1]).toBe('playlist playback error');

    mockedAxios.put.mockRejectedValueOnce(-1);
    await playPlaylist(mockDeviceId, mockPlaylistUri, mockToken);
    expect(logSpy.mock.calls.length).toBe(2);
    expect(logSpy.mock.calls[1][1]).toBe(String(-1));
  });
});
