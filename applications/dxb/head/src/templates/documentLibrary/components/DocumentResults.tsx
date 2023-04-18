import {
  ContentfulDocument,
  PimProductDocument
} from "@bmi/elasticsearch-types";
import React from "react";
import DocumentSimpleTableResults from "../../../components/DocumentSimpleTableResults";
import { DocumentTableHeader } from "../../../types/Document";
import groupBy from "../../../utils/groupBy";
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
  DocumentTableHeader[]
> = {
  simpleTable: ["add", "typeCode", "title", "size", "actions"],
  simpleArchiveTable: [
    "add",
    "title",
    "productStatus",
    "validityDate",
    "size",
    "actions"
  ]
};

const DocumentResults = ({
  data,
  assetTypes: contentfulAssetTypes,
  format
}: Props) => {
  if (format === "simpleTable" || format === "simpleArchiveTable") {
    const documentsByAssetTypeCode = groupBy(
      data,
      (document) => document.assetType.code
    );
    const documentAssetTypeCodes = Object.keys(documentsByAssetTypeCode);

    const commonAssetTypes = contentfulAssetTypes.filter((assetType) =>
      documentAssetTypeCodes.includes(assetType.code)
    );
    // eslint-disable-next-line security/detect-object-injection
    const tableHeaders = tableHeadersConfig[format].filter(
      (header) => !(commonAssetTypes.length < 2 && header.includes("type"))
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
        assetTypes={contentfulAssetTypes}
      />
    );
  }

  // TODO: Sort out the forced type cast
  return <DocumentCardsResults documents={data as ContentfulDocument[]} />;
};

export default DocumentResults;
