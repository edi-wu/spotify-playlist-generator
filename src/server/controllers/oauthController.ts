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
  const state: string = generateRandomString(16);
  const scope: string = 'playlist-modify-public';
  // pass state string to next route via req.params
  const redirectUri = `http://localhost:8080/api/getToken/${state}`;
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

oauthController.validateOAuth = (req, res, next) => {
  const { state, error } = req.query;
  // casting code from req query as string
  const code = req.query.code as string;
  const sentState: string = req.params.state;
  if (error || !code) {
    const authorizationError: ServerError = {
      log: `Spotify authorization failed. Error: ${error}`,
      status: 500,
      message: {
        err: 'An error has occurred: Spotify access denied.',
      },
    };
    return next(authorizationError);
  }
  if (sentState !== state) {
    const stateValidationError: ServerError = {
      log: 'State validation failed.',
      status: 500,
      message: { err: 'An error has occurred: unable to verify Spotify as response origin.' },
    };
    return next(stateValidationError);
  }
  res.locals.authCode = code;
  return next();
};

oauthController.generateToken = async (req, res, next) => {
  try {
    const response = await spotifyApi.authorizationCodeGrant(res.locals.authCode);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { access_token, refresh_token } = response.body;
    res.locals.cookies = { access: access_token, refresh: refresh_token };
    res.locals.redirectUrl = '/form';
    return next();
  } catch (err) {
    const tokenGenerationError: ServerError = {
      log: `Token generation failed. Error: ${err}`,
      status: 500,
      message: {
        err: 'An error has occurred: unable to obtain access token from Spotify.',
      },
    };
    return next(tokenGenerationError);
  }
};

oauthController.redirect = (req, res) => {
  res.status(302).redirect(res.locals.redirectUrl);
};

export default oauthController;