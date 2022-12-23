import axios from 'axios';
import { ENDPOINTS } from '../constants';
import { FormData } from '../types';

const generatePlaylist = async (input: FormData): Promise<string | Error> => {
  const url: string = `${ENDPOINTS.playlist}`;
  try {
    const { data } = await axios.post<string>(url, input);
    return data;
  } catch (err) {
    if (axios.isAxiosError(err) || err instanceof Error) {
      console.log('error message: ', err.message);
      return new Error(`${err.message}`);
    }
    console.log(err);
    return new Error(String(err));
  }
};

export default generatePlaylist;
