"use client";
import { HasKeyname } from "../components/inputs/Input-Text.component";
import { Field, FieldType, FieldValidations } from "../models/Block.model";
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

export const checkForErrors = (dataErrors: InputErrors[]) => {
  let hasErrors = false;
  dataErrors.forEach((inputError) => {
    if (inputError.errors.length) {
      hasErrors = true;
    }
  });
  return hasErrors;
};

export const clearAllValidations: (type: FieldType) => FieldValidations = (type: FieldType) => {
  if (type == FieldType.text) {
    return {
      isRequired: false,
      isMaxLength: false,
      isMatchRegexp: false,
      isAllowedValues: false,
    };
  } else if (type == FieldType.number) {
    return {
      isRequired: false,
      isInteger: false,
      isGreater: false,
      isLower: false,
    };
  } else if (type == FieldType.boolean) {
    return { isRequired: false };
  } else if (type == FieldType.media) {
    return { isRequired: false };
  } else if (type == FieldType.block) {
    return { isRequired: false };
  } else return {};
};

export const convertValidationsToTextList = (validations: FieldValidations, field: Field) => {
  const nonFalseValidations: FieldValidations = {};
  Object.entries(validations).forEach(([key, value]) => {
    if (value) {
      nonFalseValidations[key] = value;
    }
  });
  const convertedTextArray = Object.keys(nonFalseValidations).map((key) => {
    switch (key) {
      case "isRequired":
        return "Required";
      case "isMaxLength":
        return "Max Length: " + field.maxLength;
      case "isMatchRegexp":
        return "Matches Regexp: " + field.matchRegexp;
      case "isAllowedValues":
        return "Allow only: " + field.allowedValues?.join(", ");
      case "isInteger":
        return "Integer number";
      case "isGreater":
        return "Greater than: " + field.greaterThan;
      case "isLower":
        return "Lower than: " + field.lowerThan;
    }
  });
  return convertedTextArray.length ? convertedTextArray.join("\n") : "None";
};

export const removeNullOrUndefinedProperties = <T extends HasKeyname>(object: T) => {
  const newObject: T = {} as T;
  Object.entries(object).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== NaN && typeof value !== "object") {
      (newObject as any)[key] = value;
    }
    if (typeof value === "object") {
      (newObject as any)[key] = removeNullOrUndefinedProperties(value);
    }
  });
  return newObject;
};
