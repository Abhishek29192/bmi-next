// TODO: remove this!!
// not exported from component hence cannot use !!
// import { replaceSpaces } from "@bmi-digital/components/dist/utils/transformHyphens";
import React from "react";

const hyphenSymbol = /\{-\}/gi;

const transformHyphens = (str: React.ReactNode): React.ReactNode => {
  if (typeof str === "string") {
    return str && str.replace(hyphenSymbol, "\u00AD");
  }
  return str;
};

export const replaceSpaces = (str: React.ReactNode): string => {
  if (typeof str === "string") {
    return str && str.replace(/ /g, "-");
  }
  return "";
};

export default transformHyphens;
