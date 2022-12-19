const isPositiveIntegerString = (input: string): boolean => {
  const digitsRegexp = /^\d*$/;
  return digitsRegexp.test(input);
};

export default isPositiveIntegerString;
