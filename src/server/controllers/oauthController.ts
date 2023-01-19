import querystring from 'querystring';
import spotifyApi from '../utils/apiWrapper';
import { generateRandomString, getErrorDetails } from '../utils/helpers';
import { Controller, CookiesObj, OAuthQueryParams, ServerError } from '../types';
import { ERROR_MESSAGES, OAUTH_REDIRECT_URI } from '../constants';

const oauthController: Controller = {};

oauthController.generateRedirectUrl = (req, res, next) => {
  const clientId: string | undefined = process.env.CLIENT_ID;
  if (clientId === undefined || clientId.length === 0) {
    const noClientIdError: ServerError = {
      log: `${ERROR_MESSAGES.noClientId.log}`,
      status: 500,
      message: {
        err: `${ERROR_MESSAGES.noClientId.response}`,
      },
    };
    return next(noClientIdError);
  }
  const state: string = generateRandomString(16);
  const scope: string = 'playlist-modify-public user-read-email user-read-private streaming';
  const redirectUri = OAUTH_REDIRECT_URI;
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
  // pass state string via cookies to next route
  const cookiesObj: CookiesObj = { state };
  res.locals.cookies = cookiesObj;
  return next();
};

oauthController.validateOAuth = (req, res, next) => {
  const { state, error } = req.query;
  // casting code from req query as string
  const code = req.query.code as string;
  const sentState: string = req.cookies.state;
  if (error || !code) {
    const authorizationError: ServerError = {
      log: `${ERROR_MESSAGES.authFailed.log}`,
      status: 500,
      message: {
        err: `${ERROR_MESSAGES.authFailed.response}`,
      },
    };
    return next(authorizationError);
  }
  if (sentState !== state) {
    const stateValidationError: ServerError = {
      log: `${ERROR_MESSAGES.invalidState.log}`,
      status: 500,
      message: { err: `${ERROR_MESSAGES.invalidState.response}` },
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
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);
    const cookiesObj: CookiesObj = { access: access_token };
    res.locals.cookies = cookiesObj;
    res.locals.redirectUrl = '/#/form';
    return next();
  } catch (err: unknown) {
    const [errorLog, errorStatus] = getErrorDetails(err);
    const tokenGenerationError: ServerError = {
      log: errorLog,
      status: errorStatus,
      message: {
        err: `${ERROR_MESSAGES.tokenError.response}`,
      },
    };
    return next(tokenGenerationError);
  }
};

oauthController.validateToken = (req, res, next) => {
  const incomingToken: string = req.cookies.access;
  const storedToken: string | undefined = spotifyApi.getAccessToken();
  if (incomingToken !== storedToken) {
    const tokenValidationError: ServerError = {
      log: `${ERROR_MESSAGES.invalidAccessToken.log}`,
      status: 400,
      message: { err: `${ERROR_MESSAGES.invalidAccessToken.response}` },
    };
    return next(tokenValidationError);
  }
  return next();
};

oauthController.refreshToken = async (req, res, next) => {
  try {
    const data = await spotifyApi.refreshAccessToken();
    const newToken = data.body.access_token;
    spotifyApi.setAccessToken(newToken);
    const cookiesObj: CookiesObj = { access: newToken };
    res.locals.cookies = cookiesObj;
    res.locals.responseText = 'Access token has been refreshed.';
    return next();
  } catch (err: unknown) {
    const [errorLog, errorStatus] = getErrorDetails(err);
    const tokenRefreshError: ServerError = {
      log: errorLog,
      status: errorStatus,
      message: {
        err: `${ERROR_MESSAGES.tokenRefreshError.response}`,
      },
    };
    return next(tokenRefreshError);
  }
};

oauthController.redirect = (req, res) => {
  res.status(302).redirect(res.locals.redirectUrl);
};

export default oauthController;
