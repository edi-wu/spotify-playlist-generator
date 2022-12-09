import { Server } from 'http';
import request from 'supertest';
import app from '../app';

// TODO: test unknown endpoint giving specific error - how to test console log?
// TODO: test general global error handler

let server: Server;

beforeAll(() => {
  server = app.listen();
});

describe('test general error handling middleware', () => {
  test('middleware should handle request to unknown endpoint', async () => {
    const response: request.Response = await request(server).get(
      '/impossible-endpoint'
    );
    expect(response.status).toBe(404);
    // eslint-disable-next-line no-prototype-builtins
    expect(response.body.hasOwnProperty('err')).toBe(true);
  });

  /* TODO LATER: once there are actual functioning routes, can test general
  error handler by mocking a route callback to throw error
  */
  // it('should catch unspecified server error', async () => {
  // const response: request.Response = await request(server).get('/');
  // expect(response.status).toBe(500);
  // // eslint-disable-next-line no-prototype-builtins
  // expect(response.body.hasOwnProperty('err')).toBe(true);
  // expect(response.body.err).toBe('An error has occurred.');
  // });
});

afterAll(() => {
  server.close();
});
