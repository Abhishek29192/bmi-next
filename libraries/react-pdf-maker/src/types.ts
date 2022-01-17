export type PDFNode = string | Record<string, unknown> | PDFNodeArray;

// Circular reference work around, consider removing after upgrading to TS 3.7
export type PDFNodeArray = Array<PDFNode>;

export type PageSizeStringOptions =
  | "4A0"
  | "2A0"
  | "A0"
  | "A1"
  | "A2"
  | "A3"
  | "A4"
  | "A5"
  | "A6"
  | "A7"
  | "A8"
  | "A9"
  | "A10"
  | "B0"
  | "B1"
  | "B2"
  | "B3"
  | "B4"
  | "B5"
  | "B6"
  | "B7"
  | "B8"
  | "B9"
  | "B10"
  | "C0"
  | "C1"
  | "C2"
  | "C3"
  | "C4"
  | "C5"
  | "C6"
  | "C7"
  | "C8"
  | "C9"
  | "C10"
  | "RA0"
  | "RA1"
  | "RA2"
  | "RA3"
  | "RA4"
  | "SRA0"
  | "SRA1"
  | "SRA2"
  | "SRA3"
  | "SRA4"
  | "EXECUTIVE"
  | "FOLIO"
  | "LEGAL"
  | "LETTER"
  | "TABLOID";

export type ComponentProps = {
  children: React.ReactNode;
  [rest: string]: any;
};

export type ReturnedPageSize = {
  width: number;
  height: number;
  orientation: "portrait" | "landscape";
};
