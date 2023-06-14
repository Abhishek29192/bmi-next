import React from "react";
import { useSiteContext } from "../../../components/Site";
import { microCopy } from "../../../constants/microCopies";
import { AssetType } from "../types";
import DocumentResults, { DocumentResultData, Format } from "./DocumentResults";

export type Props = {
  results: DocumentResultData[];
  assetTypes: AssetType[];
  format: Format;
};

const ResultSection = ({ results, assetTypes, format }: Props) => {
  const { getMicroCopy } = useSiteContext();

  return (
    <>
      {results.length ? (
        <DocumentResults
          data={results}
          assetTypes={assetTypes}
          format={format}
        />
      ) : (
        getMicroCopy(microCopy.DOCUMENT_LIBRARY_NO_RESULTS)
      )}
    </>
  );
};

export default ResultSection;
