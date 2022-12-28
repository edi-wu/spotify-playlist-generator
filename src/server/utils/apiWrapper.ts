import SpotifyWebApi from 'spotify-web-api-node';
import dotenv from 'dotenv';
import { OAUTH_REDIRECT_URI } from '../constants';

dotenv.config();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: OAUTH_REDIRECT_URI,
});

export default spotifyApi;
