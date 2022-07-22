import { graphql } from "gatsby";
import React, { useMemo } from "react";
import DocumentSimpleTableResults from "../../../components/DocumentSimpleTableResults";
import { ContentfulDocument as DocumentData } from "../../../types/Document";
import {
  ProductDocument as PIMDocument,
  SystemDocument as PIMSystemDocument
} from "../../../types/pim";
import groupBy from "../../../utils/groupBy";
import DocumentCardsResults from "./DocumentCardsResults";
import DocumentTechnicalTableResults from "./DocumentTechnicalTableResults";

export type DocumentResultData = PIMDocument | DocumentData | PIMSystemDocument;

export type Format = "simpleTable" | "technicalTable" | "cards";

type Props = {
  data: DocumentResultData[];
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
    () =>
      Object.keys(groupBy(data, (document) => document.assetType.code)).length,
    [data]
  );
  const tableHeaders = ["typeCode", "title", "download", "add"].filter(
    (header) => !(assetTypesCount < 2 && header.includes("type"))
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
    ... on PIMDocument {
      productFilters {
        code
        filterCode
        value
      }
    }
  }
`;
