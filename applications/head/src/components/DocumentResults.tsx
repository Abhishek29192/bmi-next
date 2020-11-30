import axios from "axios";
import React, { useState } from "react";
import { graphql } from "gatsby";
import { Data as DocumentData } from "./Document";
import { Data as PIMDocumentData } from "./PIMDocument";
import DocumentResultsFooter from "../components/DocumentResultsFooter";
import { downloadAs } from "../utils/client-download";
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

const DOCUMENTS_PER_PAGE = 20;

const DocumentResults = ({ data, format }: Props) => {
  const [page, setPage] = useState(1);
  const count = Math.ceil(data.length / DOCUMENTS_PER_PAGE);
  const ResultsComponent = documentResultsMap[format];

  if (!ResultsComponent) {
    return null;
  }

  const handleDownloadClick = async (list: Record<string, any>) => {
    const listValues = Object.values(list).filter(Boolean);
    const currentTime = new Date().getTime();

    if (listValues.length === 0 || format === "cards") {
      return () => {};
    }

    try {
      if (!process.env.DOWNLOAD_ZIP_FUNCTION_URL) {
        throw Error(
          "`DOWNLOAD_ZIP_FUNCTION_URL` missing in environment config"
        );
      }

      const requestBody = listValues.map(
        ({ __typename, asset, title: name, url }) => ({
          href:
            __typename === "ContentfulDocument"
              ? `https:${asset.file.url}`
              : `https:${url}`,
          name
        })
      );

      const response = await axios.post(
        process.env.DOWNLOAD_ZIP_FUNCTION_URL,
        requestBody,
        { responseType: "blob" }
      );

      return downloadAs(response.data, `BMI_${currentTime}.zip`);
    } catch (error) {
      console.error("DocumentResults", error); // eslint-disable-line
    }
  };

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
        onDownloadClick={handleDownloadClick}
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
