const generateRandomString = (length: number): string => {
  // eslint-disable-next-line operator-linebreak
  const CHARSET: string =
    'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const CHARSETLENGTH = CHARSET.length;
  let result: string = '';
  for (let i = 0; i < length; i += 1) {
    const idx: number = Math.floor(Math.random() * CHARSETLENGTH);
    result += CHARSET[idx];
  }
  return result;
};

export default generateRandomString;
