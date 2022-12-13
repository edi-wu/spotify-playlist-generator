import { Server } from 'http';
import request from 'supertest';
import app from '../../app';
import oauthController from '../../controllers/oauthController';

let server: Server;

beforeAll(() => {
  server = app.listen();
});

describe('testing main application routes', () => {
  test('non-"get" requests to unknown endpoints should return 404 error', async () => {
    const response: request.Response = await request(server).post('/unknown-endpoint');
    expect(response.status).toBe(404);
    // eslint-disable-next-line no-prototype-builtins
    expect(response.body.hasOwnProperty('err')).toBe(true);
  });

  test('"get" requests to unspecified endpoints should send index.html of react app', async () => {
    const response: request.Response = await request(server).get('/unspecified-endpoint');
    expect(response.status).toBe(200);
    // eslint-disable-next-line no-prototype-builtins
    expect(response.headers['content-type']).toMatch(/text\/html/);
  });

  test('global error handler should catch unspecified server error', async () => {
    oauthController.generateRedirectUrl = jest.fn().mockReturnValueOnce(new Error('error'));
    const response: request.Response = await request(server).get('/api/login');
    expect(response.status).toBe(500);
    // eslint-disable-next-line no-prototype-builtins
    expect(response.body.hasOwnProperty('err')).toBe(true);
    expect(response.body.err).toMatch(/An error has occurred./);
  });
});

afterAll(() => {
  server.close();
});
