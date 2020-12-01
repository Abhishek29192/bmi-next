import React, { useState } from "react";
import { graphql } from "gatsby";
import { Data as DocumentData } from "./Document";
import { Data as PIMDocumentData } from "./PIMDocument";
import DocumentResultsFooter, {
  handleDownloadClick
} from "../components/DocumentResultsFooter";
import DocumentSimpleTableResults from "./DocumentSimpleTableResults";
import DocumentTechnicalTableResults from "./DocumentTechnicalTableResults";
import DocumentCardsResults from "./DocumentCardsResults";

export type Data = (PIMDocumentData | DocumentData)[];

export type Format = "simpleTable" | "technicalTable" | "cards";

type Props = {
  data: Data;
  format: Format;
};

const documentResultsMap: Record<Format, React.ElementType> = {
  simpleTable: DocumentSimpleTableResults,
  technicalTable: DocumentTechnicalTableResults,
  cards: DocumentCardsResults
};

const DOCUMENTS_PER_PAGE = 24;

const DocumentResults = ({ data, format }: Props) => {
  const [page, setPage] = useState(1);
  const count = Math.ceil(data.length / DOCUMENTS_PER_PAGE);
  const ResultsComponent = documentResultsMap[format];

  if (!ResultsComponent) {
    return null;
  }

  return (
    <>
      <ResultsComponent
        documents={data}
        page={page}
        documentsPerPage={DOCUMENTS_PER_PAGE}
      />
      <DocumentResultsFooter
        page={page}
        count={count}
        onDownloadClick={format === "cards" ? () => {} : handleDownloadClick}
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
  }
`;
