import axios from 'axios';
import { ENDPOINTS } from '../constants';
import { FormData } from '../types';

export const generatePlaylist = async (input: FormData): Promise<string | Error> => {
  const url: string = `${ENDPOINTS.playlist}`;
  try {
    const { data } = await axios.post<string>(url, input);
    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) || err instanceof Error) {
      console.log('error: ', err.message);
      return new Error(`${err.message}`);
    }
    console.log(err);
    return new Error(String(err));
  }
};

export const playPlaylist = async (
  deviceId: string,
  spotifyUri: string,
  accessToken: string
): Promise<void> => {
  const url: string = `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`;
  try {
    await axios.put(
      url,
      { context_uri: `spotify:playlist:${spotifyUri}` },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (err: unknown) {
    if (axios.isAxiosError(err) || err instanceof Error) {
      console.log('error: ', err.message);
      return;
    }
    console.log('error:', String(err));
  }
};
