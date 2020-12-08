import React, { useState, useMemo } from "react";
import { graphql } from "gatsby";
import { groupBy } from "lodash";
import { Data as DocumentData } from "./Document";
import { Data as PIMDocumentData } from "./PIMDocument";
import { Data as PIMLinkDocumentData } from "./PIMLinkDocument";
import DocumentResultsFooter, {
  handleDownloadClick
} from "../components/DocumentResultsFooter";
import DocumentSimpleTableResults, {
  getCount as getSimpleTableCount
} from "./DocumentSimpleTableResults";
import DocumentTechnicalTableResults, {
  getCount as getTechnicalTableCount
} from "./DocumentTechnicalTableResults";
import DocumentCardsResults, {
  getCount as getCardsCount
} from "./DocumentCardsResults";

export type Data = (PIMDocumentData | DocumentData | PIMLinkDocumentData)[];

export type Format = "simpleTable" | "technicalTable" | "cards";

type Props = {
  data: Data;
  format: Format;
};

const documentResultsMap: Record<
  Format,
  [(documents: Data) => number, React.ElementType]
> = {
  simpleTable: [getSimpleTableCount, DocumentSimpleTableResults],
  technicalTable: [getTechnicalTableCount, DocumentTechnicalTableResults],
  cards: [getCardsCount, DocumentCardsResults]
};

const DOCUMENTS_PER_PAGE = 24;

const DocumentResults = ({ data, format }: Props) => {
  const [page, setPage] = useState(1);
  const [getCount, ResultsComponent] = documentResultsMap[format];
  const count = Math.ceil(getCount(data) / DOCUMENTS_PER_PAGE);
  const assetTypesCount = useMemo(
    () => Object.keys(groupBy(data, "assetType.code")).length,
    [data]
  );
  const tableHeaders = ["typeCode", "title", "download", "add"].filter(
    (header) => {
      if (assetTypesCount < 2 && header.includes("type")) {
        return false;
      }

      return true;
    }
  );

  if (!ResultsComponent) {
    return null;
  }

  return (
    <>
      <ResultsComponent
        documents={data}
        page={page}
        documentsPerPage={DOCUMENTS_PER_PAGE}
        headers={tableHeaders}
      />
      <DocumentResultsFooter
        page={page}
        count={count}
        onDownloadClick={format === "cards" ? undefined : handleDownloadClick}
        onPageChange={(_, page) => setPage(page)}
      />
    </>
  );
};

export default DocumentResults;

export const query = graphql`
  fragment DocumentResultsFragment on Document {
    __typename
    ...DocumentFragment
    ...PIMDocumentFragment
    ...PIMLinkDocumentFragment
  }
`;
