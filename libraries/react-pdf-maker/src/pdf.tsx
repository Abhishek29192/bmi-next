import React from "react";
import {
  createPdf,
  tableLayouts as TableLayouts,
  vfs as Vfs
} from "pdfmake/build/pdfmake.min";
import { TDocumentDefinitions, TFontDictionary } from "pdfmake/interfaces";
import extractDefinitions from "./extractDefinitions";

const pdf = (
  element: React.ReactElement,
  tableLayouts?: typeof TableLayouts,
  fonts?: TFontDictionary,
  vfs?: typeof Vfs
) => {
  const documentDefinition = extractDefinitions(
    element
  ) as TDocumentDefinitions;
  return createPdf(documentDefinition, tableLayouts, fonts, vfs);
};

export default pdf;
