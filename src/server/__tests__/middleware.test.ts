import { Server } from 'http';
import { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import app from '../app';
import oauthController from '../controllers/oauthController';

jest.mock('../controllers/oauthController');

let server: Server;

beforeAll(() => {
  server = app.listen();
});

describe('testing error handling middleware', () => {
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
  // test('middleware should catch unspecified server error', async () => {
  //   const mockMiddlewareFn = jest.fn(oauthController.generateRedirectUrl);
  //   mockMiddlewareFn.mockImplementation(
  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     (req: Request, res: Response, next: NextFunction) => {
  //       next(new Error('test error'));
  //     }
  //   );
  //   const response: request.Response = await request(server).get('/api/login');
  //   expect(response.status).toBe(500);
  //   // eslint-disable-next-line no-prototype-builtins
  //   expect(response.body.hasOwnProperty('err')).toBe(true);
  //   expect(response.body.err).toBe('An error has occurred.');
  // });
});

afterAll(() => {
  server.close();
});
