"use client";
import { DataSnapshot } from "firebase/database";
import { ButtonProps } from "../components/Button.component";

export enum DefaultButton {
  ADD,
}

export const getDefaultButton = (button: DefaultButton, size: number = 32): ButtonProps => {
  switch (button) {
    case DefaultButton.ADD:
      return {
        onClick: () => {},
        icon: {
          src: "/icons/plus-solid.svg",
          alt: "add",
          width: size,
          height: size,
        },
      };
  }
};

export const getValuesFromSnapshot = <T>(snapshot: DataSnapshot): [string[], T[]] => {
  const data = snapshot.val();
  const keys: string[] = data ? Object.keys(data) : [];
  const values: T[] = data ? Object.values(data) : [];
  return [keys, values];
};

export const transformToCamelCase = (value: string) => {
  const noSpecialCharacters = value.replace(/[^\w\s]/gi, "").trim();
  const noStartingSymbols = noSpecialCharacters.replace(/^\d+/gi, "").trim();

  return noStartingSymbols.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
};
