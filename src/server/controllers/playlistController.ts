// import querystring from 'querystring';
import { Controller, CookiesObj, OAuthQueryParams, ServerError } from '../types';
// import generateRandomString from '../utils/helpers';
// import spotifyApi from '../utils/apiWrapper';

const playlistController: Controller = {};

playlistController.placeholder = (req, res) => {
  res.status(500).json(new Error('error'));
};

export default playlistController;
