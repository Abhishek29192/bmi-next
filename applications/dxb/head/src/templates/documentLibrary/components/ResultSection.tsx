import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React from "react";
import DocumentResultsFooter from "../../../components/DocumentResultsFooter";
import { useSiteContext } from "../../../components/Site";
import filterStyles from "../../../components/styles/Filters.module.scss";
import { AssetType } from "../types";
import DocumentResults, { DocumentResultData, Format } from "./DocumentResults";

export type Props = {
  results: DocumentResultData[];
  assetTypes: AssetType[];
  format: Format;
  page: number;
  pageCount: number;
  handlePageChange: (_: any, page: any) => void;
};

const ResultSection = ({
  results,
  assetTypes,
  format,
  page,
  pageCount,
  handlePageChange
}: Props) => {
  const { getMicroCopy } = useSiteContext();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <>
      {results.length ? (
        <>
          <DocumentResults
            data={results}
            assetTypes={assetTypes}
            format={format}
          />
          <div className={filterStyles["results"]}>
            <DocumentResultsFooter
              page={page + 1}
              count={pageCount}
              isDownloadButton={
                format === "cards" || (!matches && format === "technicalTable")
                  ? false
                  : true
              }
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        getMicroCopy("documentLibrary.noResults")
      )}
    </>
  );
};

export default ResultSection;
