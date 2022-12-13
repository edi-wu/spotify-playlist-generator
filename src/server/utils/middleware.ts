/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line object-curly-newline
import { RequestHandler, ErrorRequestHandler } from 'express';
import { ServerError } from '../types';

export const setCookies: RequestHandler = (req, res, next) => {
  const cookiesObj = res.locals.cookies;
  Object.keys(cookiesObj).forEach((key) => res.cookie(key, cookiesObj[key]));
  return next();
};

export const unknownEndpointHandler: RequestHandler = (req, res, next) => {
  const endpointError: ServerError = {
    log: 'Request was made to an unavailable endpoint.',
    status: 404,
    message: { err: 'An error has occurred: endpoint not found.' },
  };
  return next(endpointError);
};

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const defaultErr: ServerError = {
    log: 'Express error handler caught unknown middleware error.',
    status: 500,
    message: { err: 'An error has occurred.' },
  };
  const errorObj: ServerError = { ...defaultErr, ...err };
  console.log(errorObj.log);
  res.status(errorObj.status).json(errorObj.message);
};
