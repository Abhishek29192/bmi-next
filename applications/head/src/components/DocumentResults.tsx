import React, { useState } from "react";
import { graphql } from "gatsby";
import { Data as DocumentData } from "./Document";
import { Data as PIMDocumentData } from "./PIMDocument";
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

export type Data = (PIMDocumentData | DocumentData)[];

export type Format = "simpleTable" | "technicalTable" | "cards";

type Props = {
  data: Data;
  format: Format;
};

const documentResultsMap: Record<
  Format,
  [(documents: Data) => void, React.ElementType]
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
