import { ApiErrorResponse } from '../types';
import ERROR_MESSAGES from '../constants';

export const generateRandomString = (length: number): string => {
  // eslint-disable-next-line operator-linebreak
  const CHARSET: string = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const CHARSETLENGTH = CHARSET.length;
  let result: string = '';
  for (let i = 0; i < length; i += 1) {
    const idx: number = Math.floor(Math.random() * CHARSETLENGTH);
    result += CHARSET[idx];
  }
  return result;
};

const isApiErrorResponse = (error: unknown): error is ApiErrorResponse =>
  // eslint-disable-next-line implicit-arrow-linebreak
  (error as ApiErrorResponse).statusCode !== undefined &&
  (error as ApiErrorResponse).body?.error?.message !== undefined;

export const getErrorDetails = (error: unknown): [string, number] => {
  let errorLog: string = `${ERROR_MESSAGES.defaultError.log}`;
  let errorStatus: number = 500;
  if (isApiErrorResponse(error)) {
    errorLog = error.body.error.message;
    errorStatus = error.statusCode;
  }
  return [errorLog, errorStatus];
};
