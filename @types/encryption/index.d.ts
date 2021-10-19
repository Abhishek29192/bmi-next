declare module "**/encryption" {
  export const generateIdFromString: (str: string, useDate?: bool) => string;

  export const generateDigestFromData: (data: JSON) => string;
}
