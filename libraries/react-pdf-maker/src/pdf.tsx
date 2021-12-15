import pdfMake from "pdfmake/build/pdfmake.min";
import extractDefinitions from "./extractDefinitions";

const pdf = (
  element: React.ReactElement,
  tableLayouts?: object,
  fonts?: Record<string, Record<string, string>>,
  vfs?: any
) => {
  const documentDefinition = extractDefinitions(element);
  return pdfMake.createPdf(documentDefinition, tableLayouts, fonts, vfs);
};

export { pdfMake };

export default pdf;
