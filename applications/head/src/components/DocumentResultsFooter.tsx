import React, { useContext } from "react";
import Pagination from "@bmi/pagination";
import DownloadList from "@bmi/download-list";
import { SiteContext } from "./Site";
import styles from "./styles/DocumentResultsFooter.module.scss";

type Props = {
  page: number;
  count: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  onDownloadClick: (list: Record<string, any>) => void;
};

const DocumentResultsFooter = ({
  page,
  count,
  onPageChange,
  onDownloadClick
}: Props) => {
  const { getMicroCopy } = useContext(SiteContext);

  return (
    <div className={styles["DocumentResultsFooter"]}>
      <Pagination
        page={page}
        onChange={onPageChange}
        count={count}
        className={styles["pagination"]}
      />
      <DownloadList.Clear
        label={getMicroCopy("downloadList.clear")}
        className={styles["clear-downloads"]}
      />
      <DownloadList.Button
        label={`${getMicroCopy("downloadList.download")} ({{count}})`}
        onClick={onDownloadClick}
      />
    </div>
  );
};

export default DocumentResultsFooter;
