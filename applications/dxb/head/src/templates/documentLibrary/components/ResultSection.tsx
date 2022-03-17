import React from "react";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useSiteContext } from "../../../components/Site";
import filterStyles from "../../../components/styles/Filters.module.scss";
import DocumentResults, {
  Data as DocumentResultsData,
  Format
} from "../../../components/DocumentResults";
import DocumentResultsFooter, {
  handleDownloadClick
} from "../../../components/DocumentResultsFooter";

export type Props = {
  results: DocumentResultsData;
  format: Format;
  page: number;
  pageCount: number;
  handlePageChange: (_: any, page: any) => void;
};

const ResultSection = ({
  results,
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
          <DocumentResults data={results} format={format} page={page} />
          <div className={filterStyles["results"]}>
            <DocumentResultsFooter
              page={page}
              count={pageCount}
              onDownloadClick={
                format === "cards" || (!matches && format === "technicalTable")
                  ? undefined
                  : handleDownloadClick
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
