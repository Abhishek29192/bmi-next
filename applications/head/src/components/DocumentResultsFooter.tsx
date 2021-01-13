import axios from "axios";
import React, { useContext } from "react";
import Pagination from "@bmi/pagination";
import DownloadList, { DownloadListContext } from "@bmi/download-list";
import { SiteContext } from "./Site";
import styles from "./styles/DocumentResultsFooter.module.scss";
import _ from "lodash";
import { downloadAs } from "../utils/client-download";

type Props = {
  page: number;
  count: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  onDownloadClick?: (list: Record<string, any>, callback?: () => void) => void;
};

export const handleDownloadClick = async (
  list: Record<string, any>,
  callback?: () => void
) => {
  const listValues = Object.values(list).filter(Boolean);
  const [currentTime] = new Date().toJSON().replace(/-|:|T/g, "").split(".");

  if (listValues.length === 0) {
    return () => {};
  }

  try {
    if (!process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT) {
      throw Error(
        "`GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT` missing in environment config"
      );
    }

    const requestBody = _.flatten(listValues).map(
      ({ __typename, asset, extension, title, url }) => ({
        href:
          __typename === "ContentfulDocument" ? `https:${asset.file.url}` : url,
        name:
          __typename === "ContentfulDocument"
            ? `${title}.${asset.file.fileName.split(".").pop()}`
            : `${title}.${extension}`
      })
    );

    const response = await axios.post(
      process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT,
      requestBody,
      { responseType: "text" }
    );

    await downloadAs(response.data.url, `BMI_${currentTime}.zip`);

    if (callback) {
      callback();
    }
  } catch (error) {
    console.error("DocumentResults", error); // eslint-disable-line
  }
};

const DocumentResultsFooter = ({
  page,
  count,
  onPageChange,
  onDownloadClick
}: Props) => {
  const { getMicroCopy } = useContext(SiteContext);
  const { resetList } = useContext(DownloadListContext);

  return (
    <div className={styles["DocumentResultsFooter"]}>
      <Pagination
        page={page}
        onChange={onPageChange}
        count={count}
        className={styles["pagination"]}
      />
      {onDownloadClick && (
        <>
          <DownloadList.Clear
            label={getMicroCopy("downloadList.clear")}
            className={styles["clear-downloads"]}
          />
          <DownloadList.Button
            label={`${getMicroCopy("downloadList.download")} ({{count}})`}
            onClick={(list) => onDownloadClick(list, resetList)}
          />
        </>
      )}
    </div>
  );
};

export default DocumentResultsFooter;
