import { RequestHandler } from 'express';

export type Controller = Record<string, RequestHandler>;

export type ServerError = {
  log: string;
  status: number;
  message: {
    err: string;
  };
};
