import httpMocks from 'node-mocks-http';
import oauthController from '../../controllers/oauthController';
import { generateRandomString } from '../../utils/helpers';
import spotifyApi from '../../utils/apiWrapper';
import ERROR_MESSAGES from '../../constants';

const response = httpMocks.createResponse();
const next = jest.fn();

// clear response.locals object before each test to avoid properties persisting
beforeEach(() => {
  response.locals = {};
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('testing middleware that generates Spotify OAuth redirect URL', () => {
  const OLD_ENV = process.env;
  const request = httpMocks.createRequest({
    method: 'GET',
    url: '/api/login',
  });

  beforeEach(() => {
    jest.resetModules(); // clear cache of env values
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  test('middleware should throw error if missing client ID', () => {
    process.env.CLIENT_ID = '';
    oauthController.generateRedirectUrl(request, response, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        log: `${ERROR_MESSAGES.noClientId.log}`,
        status: 500,
        message: expect.objectContaining({ err: `${ERROR_MESSAGES.noClientId.response}` }),
      })
    );
  });

  test('middleware should add valid redirect URL and state string to res.locals', () => {
    process.env.CLIENT_ID = 'testclientid';
    oauthController.generateRedirectUrl(request, response, next);
    expect(response.locals).toHaveProperty('redirectUrl');
    const { redirectUrl } = response.locals;
    expect(redirectUrl).toMatch(/^https:\/\/accounts.spotify.com\/authorize\?*/);
    expect(redirectUrl).toMatch(/(client_id)/);
    expect(redirectUrl).toMatch(/(redirect_uri)/);
    expect(redirectUrl).toMatch(/(scope)/);
    expect(redirectUrl).toMatch(/(state)/);
    expect(redirectUrl).toMatch(/(response_type=code)/);
    expect(response.locals).toHaveProperty('cookies');
    const { cookies } = response.locals;
    expect(cookies).toHaveProperty('state');
    expect(cookies.state.length).toBe(16);
    expect(next).toHaveBeenCalled();
  });
});

describe('testing middleware that validates OAuth response', () => {
  const state: string = generateRandomString(16);
  const request = httpMocks.createRequest({
    method: 'GET',
    url: '/getToken',
    cookies: { state },
  });

  test('middleware should throw error if missing state string', () => {
    request.query = { code: 'testcode' };
    oauthController.validateOAuth(request, response, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        log: `${ERROR_MESSAGES.invalidState.log}`,
        status: 500,
        message: expect.objectContaining({ err: `${ERROR_MESSAGES.invalidState.response}` }),
      })
    );
  });

  test('middleware should throw error if state string does not match', () => {
    let badState: string = generateRandomString(16);
    while (badState === state) {
      badState = generateRandomString(16);
    }
    request.query = { code: 'testcode', state: badState };
    oauthController.validateOAuth(request, response, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        log: `${ERROR_MESSAGES.invalidState.log}`,
        status: 500,
        message: expect.objectContaining({ err: `${ERROR_MESSAGES.invalidState.response}` }),
      })
    );
  });

  test('middleware should throw error if no code returned', () => {
    request.query = { state };
    oauthController.validateOAuth(request, response, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        log: `${ERROR_MESSAGES.authFailed.log}`,
        status: 500,
        message: expect.objectContaining({ err: `${ERROR_MESSAGES.authFailed.response}` }),
      })
    );
  });

  test('middleware should throw error if error string returned', () => {
    request.query = { error: 'access_denied', state };
    oauthController.validateOAuth(request, response, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        log: `${ERROR_MESSAGES.authFailed.log}`,
        status: 500,
        message: expect.objectContaining({ err: `${ERROR_MESSAGES.authFailed.response}` }),
      })
    );
  });

  test('middleware should add code to res.locals', () => {
    const code = 'testcode';
    request.query = { code, state };
    oauthController.validateOAuth(request, response, next);
    expect(response.locals).toHaveProperty('authCode');
    expect(response.locals.authCode).toMatch(code);
    expect(next).toHaveBeenCalled();
  });
});

describe('testing middleware that obtains access token', () => {
  const state: string = generateRandomString(16);
  const request = httpMocks.createRequest({
    method: 'GET',
    url: '/getToken',
    params: { state },
  });

  test('middleware should throw error if Spotify API returns error', async () => {
    spotifyApi.authorizationCodeGrant = jest.fn().mockReturnValueOnce(new Error());
    await oauthController.generateToken(request, response, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        log: `${ERROR_MESSAGES.tokenError.log}`,
        status: 500,
        message: expect.objectContaining({ err: `${ERROR_MESSAGES.tokenError.response}` }),
      })
    );
  });

  test('middleware should add cookies and redirect URL to res.locals upon success', async () => {
    spotifyApi.authorizationCodeGrant = jest.fn().mockReturnValueOnce({
      body: {
        access_token: 'test-access',
        expires_in: 200000,
        refresh_token: 'test-refresh',
        scope: 'test-scope',
        token_type: 'test',
      },
    });
    await oauthController.generateToken(request, response, next);
    expect(response.locals).toHaveProperty('cookies');
    expect(response.locals.cookies).toEqual({ access: 'test-access', refresh: 'test-refresh' });
    expect(response.locals).toHaveProperty('redirectUrl');
    expect(response.locals.redirectUrl).toBe('/#/form');
    expect(next).toHaveBeenCalled();
  });
});

describe('testing middleware that redirects request', () => {
  const request = httpMocks.createRequest({
    method: 'GET',
    url: '/any-route',
  });

  test('middleware should redirect to provided URL with correct status code', () => {
    response.locals.redirectUrl = 'testURL';
    response.redirect = jest.fn();
    oauthController.redirect(request, response, next);
    expect(response.statusCode).toBe(302);
    expect(response.redirect).toHaveBeenCalledWith('testURL');
  });
});
