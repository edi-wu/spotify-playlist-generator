/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler, ErrorRequestHandler } from 'express';
import { CookiesObj, ServerError } from '../types';
import { ERROR_MESSAGES } from '../constants';

export const setCookies: RequestHandler = (req, res, next) => {
  const cookiesObj: CookiesObj = res.locals.cookies;
  Object.keys(cookiesObj).forEach((key) => res.cookie(key, cookiesObj[key]));
  return next();
};

export const returnSuccessResponse: RequestHandler = (req, res) => {
  const { responseText } = res.locals;
  res.status(200).json(responseText);
};

export const unknownEndpointHandler: RequestHandler = (req, res, next) => {
  const endpointError: ServerError = {
    log: `${ERROR_MESSAGES.noEndpoint.log}`,
    status: 404,
    message: { err: `${ERROR_MESSAGES.noEndpoint.response}` },
  };
  return next(endpointError);
};

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const defaultErr: ServerError = {
    log: `${ERROR_MESSAGES.defaultError.log}`,
    status: 500,
    message: { err: `${ERROR_MESSAGES.defaultError.response}` },
  };
  const errorObj: ServerError = { ...defaultErr, ...err };
  console.log(errorObj.log);
  res.status(errorObj.status).json(errorObj.message);
};
