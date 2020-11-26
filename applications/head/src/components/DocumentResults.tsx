import React from "react";
import { graphql } from "gatsby";
import { Data as DocumentData } from "./Document";
import { Data as PIMDocumentData } from "./PIMDocument";

export type Data = (PIMDocumentData | DocumentData)[];

type Props = {
  data: Data;
  format: "simpleTable" | "technicalTable" | "cards";
};

const DocumentResults = ({ data, format }: Props) => {
  // TODO: Logic here will show different types of results based on the format.
  return <p>Silence is golden</p>;
};

export default DocumentResults;

export const query = graphql`
  fragment DocumentResultsFragment on Document {
    __typename
    ...DocumentFragment
    ...PIMDocumentFragment
  }
`;
