import querystring from 'querystring';
import spotifyApi from '../utils/apiWrapper';
import { generateRandomString, getErrorDetails } from '../utils/helpers';
import { Controller, CookiesObj, OAuthQueryParams, ServerError } from '../types';
import { ERROR_MESSAGES } from '../constants';

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
  const scope: string = 'playlist-modify-public';
  const redirectUri = 'http://localhost:8080/api/getToken';
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
    const cookiesObj: CookiesObj = { access: access_token, refresh: refresh_token };
    res.locals.cookies = cookiesObj;
    res.locals.redirectUrl = '/#/form';
    return next();
  } catch (err) {
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

oauthController.redirect = (req, res) => {
  res.status(302).redirect(res.locals.redirectUrl);
};

export default oauthController;
