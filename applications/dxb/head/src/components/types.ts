export const All_FORMATS = [
  "application/pdf",
  "application/zip",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
] as const;
export type Format = (typeof All_FORMATS)[number];
