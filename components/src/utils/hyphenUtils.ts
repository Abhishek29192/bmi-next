import React from "react";

const hyphenSymbol = /\{-\}/gi;

export const transformHyphens = (str: React.ReactNode): React.ReactNode => {
  if (typeof str === "string") {
    return str && str.replace(hyphenSymbol, "\u00AD");
  }
  return str;
};
