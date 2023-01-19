import axios from 'axios';
import refreshToken from '../../services/oauthService';
import { ENDPOINTS } from '../../constants';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

afterEach(() => {
  jest.clearAllMocks();
});

describe('testing function to refresh access token', () => {
  test('function should make "GET" request to refresh token', async () => {
    await refreshToken();
    expect(mockedAxios.get).toHaveBeenCalledWith(`${ENDPOINTS.refreshToken}`);
  });

  test('function should console log error message', async () => {
    const logSpy = jest.spyOn(console, 'log');
    mockedAxios.get.mockRejectedValueOnce(new Error('token refresh error'));
    await refreshToken();
    expect(logSpy.mock.calls.length).toBe(1);
    expect(logSpy.mock.calls[0][1]).toBe('token refresh error');

    mockedAxios.get.mockRejectedValueOnce(-1);
    await refreshToken();
    expect(logSpy.mock.calls.length).toBe(2);
    expect(logSpy.mock.calls[1][1]).toBe(String(-1));
  });
});
