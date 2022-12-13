import querystring from 'querystring';
import { Controller, OAuthQueryParams, ServerError } from '../types';
import generateRandomString from '../utils/helpers';
import spotifyApi from '../utils/apiWrapper';

const oauthController: Controller = {};

oauthController.generateRedirectUrl = (req, res, next) => {
  const clientId: string | undefined = process.env.CLIENT_ID;
  if (clientId === undefined || clientId.length === 0) {
    const noClientIdError: ServerError = {
      log: 'Missing Spotify client ID in .env.',
      status: 500,
      message: {
        err: 'An error has occurred: application is missing valid Spotify client ID.',
      },
    };
    return next(noClientIdError);
  }
  const redirectUri = 'http://localhost:8080/api/getToken';
  const scope: string = 'playlist-modify-public';
  const state: string = generateRandomString(16);
  const paramsObj: OAuthQueryParams = {
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    state,
    response_type: 'code',
  };
  const BASEURL: string = 'https://accounts.spotify.com/authorize?';
  const redirectUrl: string = BASEURL + querystring.stringify(paramsObj);
  res.locals.redirectUrl = redirectUrl;
  return next();
};

oauthController.redirect = (req, res) => {
  res.status(302).redirect(res.locals.redirectUrl);
};

export default oauthController;
