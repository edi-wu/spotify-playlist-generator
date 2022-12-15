import httpMocks from 'node-mocks-http';
import * as middleware from '../utils/middleware';
import { ServerError } from '../types';

const request = httpMocks.createRequest();
const response = httpMocks.createResponse();
const next = jest.fn();

describe('testing middleware handlers', () => {
  test('cookie setter should set all provided cookies', () => {
    response.cookie = jest.fn();
    response.locals.cookies = { cookie1: 'choco', cookie2: 'oatmeal', cookie3: 'gingerbread' };
    middleware.setCookies(request, response, next);
    // eslint-disable-next-line no-prototype-builtins
    expect(response.cookie).toHaveBeenCalledTimes(3);
    expect(response.cookie).toHaveBeenNthCalledWith(1, 'cookie1', 'choco');
    expect(response.cookie).toHaveBeenNthCalledWith(2, 'cookie2', 'oatmeal');
    expect(response.cookie).toHaveBeenNthCalledWith(3, 'cookie3', 'gingerbread');
    expect(next).toHaveBeenCalled();
  });

  test('unknown endpoint handler should call next function with error', () => {
    middleware.unknownEndpointHandler(request, response, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        log: expect.any(String),
        status: 404,
        message: expect.objectContaining({ err: expect.any(String) }),
      })
    );
  });

  test('global error handler should return correct error status and message', () => {
    const customError: ServerError = {
      log: 'testing error handler',
      status: 417,
      message: {
        err: 'testing error handler',
      },
    };
    middleware.globalErrorHandler(customError, request, response, next);
    expect(response.statusCode).toBe(417);
    // eslint-disable-next-line no-underscore-dangle
    const sentData = JSON.parse(response._getData());
    expect(sentData).toEqual({ err: 'testing error handler' });
  });
});
