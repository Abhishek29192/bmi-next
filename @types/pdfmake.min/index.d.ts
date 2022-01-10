/// <reference lib="dom" />

declare module "pdfmake/build/pdfmake.min" {
  import { createPdf, fonts, tableLayouts, TCreatedPdf, vfs } from "pdfmake";

  export { createPdf, fonts, tableLayouts, TCreatedPdf, vfs };
}
