import { ExportToCsv, Options } from "export-to-csv";

const defaultOptions: Options = {
  filename: "report",
  fieldSeparator: ",",
  quoteStrings: '"',
  decimalSeparator: ".",
  showLabels: true,
  showTitle: true,
  title: "Report",
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: true
};

export const exportCsv = (data, options: Options = {}) => {
  const option = { ...defaultOptions, ...options };
  const csvExporter = new ExportToCsv(option);
  csvExporter.generateCsv(data);
};
