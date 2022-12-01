/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';

type ServerError = {
  log: string;
  status: number;
  message: {
    err: string;
  };
};

export const unknownEndpoint = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errorObj: ServerError = {
    log: 'Request was made to an unavailable endpoint.',
    status: 404,
    message: { err: 'An error has occurred: endpoint not found.' },
  };
  return next(errorObj);
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
