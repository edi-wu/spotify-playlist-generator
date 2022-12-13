import httpMocks from 'node-mocks-http';
import oauthController from '../../controllers/oauthController';

const request = httpMocks.createRequest({
  method: 'GET',
  url: '/api/login',
});

const response = httpMocks.createResponse();
const next = jest.fn();

describe('testing middleware to generate Spotify OAuth redirect URL', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // clear cache of env values
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  test('middleware should call next function with error if missing client ID', () => {
    process.env.CLIENT_ID = '';
    oauthController.generateRedirectUrl(request, response, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        log: expect.any(String),
        status: expect.any(Number),
        message: expect.objectContaining({ err: expect.any(String) }),
      })
    );
  });

  test('middleware should add valid redirect URL onto res.locals', () => {
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
    expect(next).toHaveBeenCalled();
  });
});

describe('testing middleware to redirect request', () => {
  test('middleware should redirect to provided URL with correct status code', async () => {
    response.locals.redirectUrl = 'testURL';
    response.redirect = jest.fn();
    oauthController.redirect(request, response, next);
    expect(response.statusCode).toBe(302);
    expect(response.redirect).toHaveBeenCalledWith('testURL');
  });
});
