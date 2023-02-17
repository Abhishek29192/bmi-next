import React from "react";
import {
  ContentfulDocument,
  PimProductDocument
} from "@bmi/elasticsearch-types";
import DocumentSimpleTableResults, {
  AvailableHeader
} from "../../../components/DocumentSimpleTableResults";
import { AssetType } from "../types";
import DocumentCardsResults from "./DocumentCardsResults";
import DocumentTechnicalTableResults from "./DocumentTechnicalTableResults";

export type DocumentResultData = ContentfulDocument | PimProductDocument;

export type Format =
  | "simpleTable"
  | "simpleArchiveTable"
  | "technicalTable"
  | "cards";

type Props = {
  data: DocumentResultData[];
  assetTypes: AssetType[];
  format: Format;
};

const tableHeadersConfig: Record<
  "simpleTable" | "simpleArchiveTable",
  AvailableHeader[]
> = {
  simpleTable: ["typeCode", "title", "download", "add"],
  simpleArchiveTable: [
    "title",
    "productStatus",
    "validityDate",
    "download",
    "add"
  ]
};

const DocumentResults = ({ data, assetTypes, format }: Props) => {
  if (format === "simpleTable" || format === "simpleArchiveTable") {
    // eslint-disable-next-line security/detect-object-injection
    const tableHeaders = tableHeadersConfig[format].filter(
      (header) => !(assetTypes.length < 2 && header.includes("type"))
    );
    return (
      <DocumentSimpleTableResults documents={data} headers={tableHeaders} />
    );
  }

  if (format === "technicalTable") {
    // TODO: Sort out the forced type cast
    return (
      <DocumentTechnicalTableResults
        documents={data as PimProductDocument[]}
        assetTypes={assetTypes}
      />
    );
  }

  // TODO: Sort out the forced type cast
  return <DocumentCardsResults documents={data as ContentfulDocument[]} />;
};

export default DocumentResults;
