import { ApiErrorResponse } from '../types';
import ERROR_MESSAGES from '../constants';

export const generateRandomString = (length: number): string => {
  // eslint-disable-next-line operator-linebreak
  const CHARSET: string = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const CHARSETLENGTH: number = CHARSET.length;
  let result: string = '';
  for (let i = 0; i < length; i += 1) {
    const idx: number = Math.floor(Math.random() * CHARSETLENGTH);
    result += CHARSET[idx];
  }
  return result;
};

export class ApiError extends Error {
  statusCode: number;

  body: { error: { status: number; message: string } };

  constructor(code: number, log: string) {
    super();
    this.statusCode = code;
    this.body = { error: { status: code, message: log } };
  }
}

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

export const convertInputToMilliseconds = (hours: string, minutes: string): number => {
  let result: number = 0;
  const hoursParsed: number = parseInt(hours, 10);
  const minutesParsed: number = parseInt(minutes, 10);
  if (Number.isNaN(hoursParsed) && Number.isNaN(minutesParsed)) {
    throw new ApiError(400, 'Missing both hours and minutes input.');
  }
  if (!Number.isNaN(hoursParsed)) {
    result += hoursParsed * 60 * 60 * 1000;
  }
  if (!Number.isNaN(minutesParsed)) {
    result += minutesParsed * 60 * 1000;
  }
  return result;
};
