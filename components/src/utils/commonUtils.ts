const hyphenSymbol = /\|/g;

export const transformHyphens = (str: any): any => {
  if (typeof str === "string") {
    return str && str.replace(hyphenSymbol, "\u00AD");
  }
  return str;
};
