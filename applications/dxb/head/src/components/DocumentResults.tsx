import React, { useMemo } from "react";
import { graphql } from "gatsby";
import { groupBy } from "lodash";
import {
  PIMDocumentData,
  PIMLinkDocumentData
} from "../components/types/PIMDocumentBase";
import { Data as DocumentData } from "./Document";
import DocumentSimpleTableResults from "./DocumentSimpleTableResults";
import DocumentTechnicalTableResults from "./DocumentTechnicalTableResults";
import DocumentCardsResults from "./DocumentCardsResults";

export type Data = (PIMDocumentData | DocumentData | PIMLinkDocumentData)[];

export type Format = "simpleTable" | "technicalTable" | "cards";

type Props = {
  data: Data;
  format: Format;
  page: number;
};

const documentResultsMap: Record<Format, React.ElementType> = {
  simpleTable: DocumentSimpleTableResults,
  technicalTable: DocumentTechnicalTableResults,
  cards: DocumentCardsResults
};

const DOCUMENTS_PER_PAGE = 24;

const DocumentResults = ({ data, format, page }: Props) => {
  // eslint-disable-next-line security/detect-object-injection
  const ResultsComponent = documentResultsMap[format];
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

  return (
    <>
      <ResultsComponent
        documents={data}
        page={page}
        documentsPerPage={DOCUMENTS_PER_PAGE}
        headers={tableHeaders}
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
