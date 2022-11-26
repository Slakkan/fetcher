export interface Block {
  name: string;
  keyName: string;
  project: string;
  fields?: Field[];
}

export interface Field {
  name: string;
  keyName: string;
  type: FieldType;
  validations: FieldValidations;
  display: FieldDisplay;
  allowedValues?: string[];
  matchRegexp?: string;
  maxLength?: number;
  greaterThan?: number;
  lowerThan?: number;
}

export enum FieldType {
  text = "text",
  number = "number",
  boolean = "boolean",
  media = "media",
  block = "block",
}

export interface TextValidations {
  isRequired?: boolean;
  isMaxLength?: boolean;
  isMatchRegexp?: boolean;
  isAllowedValues?: boolean;
}

export interface NumberValidations {
  isRequired?: boolean;
  isInteger?: boolean;
  isGreater?: boolean;
  isLower?: boolean;
}

export interface BooleanValidations {
  isRequired?: boolean;
}

export interface MediaValidations {
  isRequired?: boolean;
}

export interface BlockValidations {
  isRequired?: boolean;
}

export type FieldValidations = TextValidations &
  NumberValidations &
  BooleanValidations &
  MediaValidations &
  BlockValidations &
  Record<string, any>;

export enum TextDisplay {
  isInputText = "Text Input",
  isRadio = "Radio Buttons",
  isList = "Checkbox List",
  isDropdown = "Text Dropdown",
}

export enum NumberDisplay {
  isInputText = "Text Input",
}

export enum BooleanDisplay {
  isCheckbox = "Checkbox",
  isRadio = "Radio Buttons",
}

export enum MediaDisplay {
  isComplete = "Show all details",
  isFilename = "Show only filename",
  isPreview = "Show only preview",
}

export enum BlockDisplay {
  isFrame = "Grid",
}

export type FieldDisplay = TextDisplay | NumberDisplay | BooleanDisplay | MediaDisplay | BlockDisplay;

export interface EditField extends FieldValidations {
  name: string;
  keyName: string;
  type: FieldType;
  allowedValues?: string[];
  matchRegexp?: string;
  maxLength?: number;
  greaterThan?: number;
  lowerThan?: number;
  display: FieldDisplay;
  [keyName: string]: any;
}
