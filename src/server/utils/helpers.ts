import { ApiErrorResponse } from '../types';

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

export const isApiErrorResponse = (error: unknown): error is ApiErrorResponse =>
  // eslint-disable-next-line implicit-arrow-linebreak
  (error as ApiErrorResponse).statusCode !== undefined &&
  (error as ApiErrorResponse).body?.error?.message !== undefined;
