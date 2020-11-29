import React from "react";
import { graphql } from "gatsby";
import { Data as DocumentData } from "./Document";
import { Data as PIMDocumentData } from "./PIMDocument";
import DocumentSimpleTableResults from "./DocumentSimpleTableResults";

export type Data = (PIMDocumentData | DocumentData)[];

type Props = {
  data: Data;
  format: "simpleTable" | "technicalTable" | "cards";
};

const documentResultsMap = {
  simpleTable: DocumentSimpleTableResults
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
