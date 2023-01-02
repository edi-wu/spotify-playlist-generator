import axios from 'axios';
import { ENDPOINTS } from '../constants';

const refreshToken = async (): Promise<null | Error> => {
  const url: string = `${ENDPOINTS.refreshToken}`;
  try {
    await axios.get<void>(url);
    return null;
  } catch (err) {
    if (axios.isAxiosError(err) || err instanceof Error) {
      console.log('error: ', err.message);
      return new Error(`${err.message}`);
    }
    console.log(' error: ', String(err));
    return new Error(String(err));
  }
};

export default refreshToken;
