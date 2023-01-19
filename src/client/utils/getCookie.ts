const getCookie = (name: string): string => {
  const allCookies: string[] = document.cookie.split(';').map((cookie) => cookie.trim());
  let result = '';
  allCookies.forEach((cookie) => {
    if (cookie.startsWith(name)) {
      result += cookie.slice(name.length + 1);
    }
  });
  return result;
};

export default getCookie;
