import { RequestHandler } from 'express';

export type OAuthQueryParams = {
  client_id: string | undefined;
  response_type: 'code';
  redirect_uri: string;
  scope?: string;
  state?: string;
};

export type Controller = Record<string, RequestHandler>;

export type ServerError = {
  log: string;
  status: number;
  message: {
    err: string;
  };
};
