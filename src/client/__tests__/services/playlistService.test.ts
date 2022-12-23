import axios from 'axios';
import generatePlaylist from '../../services/playlistService';
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
