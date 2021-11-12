import { CompanyDocumentType } from "@bmi/intouch-api-types";

const companyDocumentExtensions: { [K in string]: CompanyDocumentType } = {
  PDF: "PDF",
  JPG: "JPG",
  JPEG: "JPEG",
  PNG: "PNG"
};

export const getDocumentType = (
  path: string
): CompanyDocumentType | undefined => {
  const fileExtension: string = (path || "")
    .split(/[\\/]/)
    .pop()
    .split(".")
    .pop()
    .toUpperCase();

  return companyDocumentExtensions[fileExtension];
};
