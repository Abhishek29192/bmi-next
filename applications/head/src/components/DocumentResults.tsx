import React from "react";
import { graphql } from "gatsby";
import { Data as DocumentData } from "./Document";
import { Data as PIMDocumentData } from "./PIMDocument";
import DocumentSimpleTableResults from "./DocumentSimpleTableResults";
import DocumentTechnicalTableResults from "./DocumentTechnicalTableResults";

export type Data = (PIMDocumentData | DocumentData)[];

export type Format = "simpleTable" | "technicalTable" | "cards";

type Props = {
  data: Data;
  format: Format;
};

const documentResultsMap: Record<Format, React.ElementType> = {
  simpleTable: DocumentSimpleTableResults,
  technicalTable: DocumentTechnicalTableResults,
  cards: null
};

const DocumentResults = ({ data, format }: Props) => {
  const ResultsComponent = documentResultsMap[format];

  if (!ResultsComponent) {
    return null;
  }

  return <ResultsComponent documents={data} />;
};

export default DocumentResults;

export const query = graphql`
  fragment DocumentResultsFragment on Document {
    __typename
    ...DocumentFragment
    ...PIMDocumentFragment
  }
`;
