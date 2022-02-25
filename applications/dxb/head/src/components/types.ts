export const All_FORMATS = [
  "application/pdf",
  "application/zip",
  "image/jpg",
  "image/jpeg",
  "image/png"
] as const;
export type Format = typeof All_FORMATS[number];
