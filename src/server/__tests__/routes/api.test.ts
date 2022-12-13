import { Server } from 'http';
import request from 'supertest';
import app from '../../app';

let server: Server;

beforeAll(() => {
  server = app.listen();
});

describe('testing redirect to Spotify OAuth URL', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // clear cache of env values
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  test('route should return error if missing client ID from env', async () => {
    process.env.CLIENT_ID = '';
    const response: request.Response = await request(server).get('/api/login');
    expect(response.status).toBe(500);
    // eslint-disable-next-line no-prototype-builtins
    expect(response.body.hasOwnProperty('err')).toBe(true);
  });

  test('route should successfully redirect to Spotify OAuth link', async () => {
    process.env.CLIENT_ID = 'testclientid';
    const response: request.Response = await request(server).get('/api/login');
    expect(response.status).toBe(302);
  });
});

afterAll(() => {
  server.close();
});
