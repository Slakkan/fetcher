import { Dispatch, SetStateAction } from "react";

export interface InputErrors {
  keyName: string;
  formKeyName?: string;
  errors: string[];
  showErrors?: boolean;
}
