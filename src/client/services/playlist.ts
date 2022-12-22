import { FormData } from '../types';

const generatePlaylist = (data: FormData): string => {
  console.log('incoming data:', data);
  return 'fake-playlist-id';
};

export default generatePlaylist;
