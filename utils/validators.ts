import { InputErrors } from "../models/Input.model";

export const isValidPropertyName = (string: string) => {
  const validPropRegExp = new RegExp(/^(?![0-9])[a-zA-Z0-9$_]+$/);
  return validPropRegExp.test(string);
};

export const isNumber = (string: string) => {
  return /\d+/.test(string);
};

export const isClamped = (min: number, number: number, max: number) => {
  const isHigherThanMin = Math.min(min, number) === min;
  const isLowerThanMax = Math.max(max, number) === max;
  return isLowerThanMax && isHigherThanMin;
};

export const isObjectNotEmpty = <T extends Record<string, any>>(object: T | {}): object is T => {
  const numberOfEntries = Object.entries(object).length;
  return numberOfEntries !== 0;
};

export const checkForErrors = (dataErrors: InputErrors[]) => {
  let hasErrors = false;
  dataErrors.forEach((inputError) => {
    if (inputError.errors.length) {
      hasErrors = true;
    }
  });
  return hasErrors;
};
