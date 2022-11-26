import InputCheckboxDummy from "../dummies/InputCheckboxDummy";
import InputDropdownDummy from "../dummies/InputDropdownDummy";
import InputListDummy from "../dummies/InputListDummy";
import InputRadioDummy from "../dummies/InputRadioDummy";
import InputTextDummy from "../dummies/InputTextDummy";
import {
  BlockDisplay,
  BooleanDisplay,
  EditField,
  FieldDisplay,
  FieldType,
  MediaDisplay,
  NumberDisplay,
  TextDisplay,
} from "../models/Block.model";

export const getDefaultDisplay: (type: FieldType) => FieldDisplay = (type) => {
  let display: FieldDisplay;
  if (type === "text") {
    display = TextDisplay.isInputText;
  } else if (type === "number") {
    display = NumberDisplay.isInputText;
  } else if (type === "boolean") {
    display = BooleanDisplay.isCheckbox;
  } else if (type === "media") {
    display = MediaDisplay.isComplete;
  } else if (type === "block") {
    display = BlockDisplay.isFrame;
  } else {
    display = TextDisplay.isInputText;
  }
  return display;
};

export const convertDisplayToSavedData: (field: EditField) => EditField = (field) => {
  const defaultValues = {
    isInputText: false,
    isDropdown: false,
    isList: false,
    isRadio: false,
    isCheckbox: false,
    isComplete: false,
    isFilename: false,
    isPreview: false,
    isFrame: false,
  };
  switch (field.display) {
    case TextDisplay.isInputText:
      return { ...field, ...defaultValues, isInputText: true };
    case TextDisplay.isDropdown:
      return { ...field, ...defaultValues, isDropdown: true };
    case TextDisplay.isList:
      return { ...field, ...defaultValues, isList: true };
    case TextDisplay.isRadio:
      return { ...field, ...defaultValues, isRadio: true };
    case NumberDisplay.isInputText:
      return { ...field, ...defaultValues, isInputText: true };
    case BooleanDisplay.isCheckbox:
      return { ...field, ...defaultValues, isCheckbox: true };
    case BooleanDisplay.isRadio:
      return { ...field, ...defaultValues, isRadio: true };
    case MediaDisplay.isComplete:
      return { ...field, ...defaultValues, isComplete: true };
    case MediaDisplay.isFilename:
      return { ...field, ...defaultValues, isFilename: true };
    case MediaDisplay.isPreview:
      return { ...field, ...defaultValues, isPreview: true };
    case BlockDisplay.isFrame:
      return { ...field, ...defaultValues, isFrame: true };
  }
};

export const mapDisplayIntoComponent: (field: EditField) => JSX.Element = (field) => {
  switch (field.display) {
    case TextDisplay.isInputText:
      return <InputTextDummy />
    case TextDisplay.isDropdown:
      return <InputDropdownDummy valueList={field.allowedValues!} />
    case TextDisplay.isList:
      return <InputListDummy valueList={field.allowedValues!} />
    case TextDisplay.isRadio:
      return <InputRadioDummy valueList={field.allowedValues!} />
    case NumberDisplay.isInputText:
      return <InputTextDummy />
    case BooleanDisplay.isCheckbox:
      return <InputCheckboxDummy> <span className="me-3">{field.name}:</span></InputCheckboxDummy>
    case BooleanDisplay.isRadio:
      return <InputRadioDummy valueList={["true", "false"]} />
    case MediaDisplay.isComplete:
      return <></>
    case MediaDisplay.isFilename:
      return <></>
    case MediaDisplay.isPreview:
      return <></>
    case BlockDisplay.isFrame:
      return <></>
  }
}