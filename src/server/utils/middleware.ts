/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line object-curly-newline
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ServerError } from '../types';

export const unknownEndpoint: RequestHandler = (req, res, next) => {
  const endpointError: ServerError = {
    log: 'Request was made to an unavailable endpoint.',
    status: 404,
    message: { err: 'An error has occurred: endpoint not found.' },
  };
  return next(endpointError);
};

export const globalErrorHandler = (
  err: ServerError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const defaultErr: ServerError = {
    log: 'Express error handler caught unknown middleware error.',
    status: 500,
    message: { err: 'An error has occurred.' },
  };
  const errorObj: ServerError = { ...defaultErr, ...err };
  console.log(errorObj.log);
  res.status(errorObj.status).json(errorObj.message);
};
