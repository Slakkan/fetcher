

export const isValidPropertyName = (string: string) => {
  const validPropRegExp = new RegExp(/^(?![0-9])[a-zA-Z0-9$_]+$/);
  return validPropRegExp.test(string)
};

