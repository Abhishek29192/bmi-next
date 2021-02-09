import axios from "axios";
import React, { useContext } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import Pagination from "@bmi/pagination";
import DownloadList, { DownloadListContext } from "@bmi/download-list";
import { flatten } from "lodash";
import { downloadAs } from "../utils/client-download";
import { SiteContext } from "./Site";
import styles from "./styles/DocumentResultsFooter.module.scss";

type Props = {
  page: number;
  count: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  onDownloadClick?: (
    list: Record<string, any>,
    token: string,
    callback?: () => void
  ) => void;
};

export const handleDownloadClick = async (
  list: Record<string, any>,
  token: string,
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

    const documents = flatten(listValues).map(
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
      { documents: documents },
      { responseType: "text", headers: { "X-Recaptcha-Token": token } }
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
  const {
    getMicroCopy,
    countryCode,
    scriptGRecaptchaId,
    scriptGRecaptchaNet
  } = useContext(SiteContext);
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
        <GoogleReCaptchaProvider
          reCaptchaKey={scriptGRecaptchaId}
          useRecaptchaNet={scriptGRecaptchaNet}
          language={countryCode}
        >
          <DownloadList.Clear
            label={getMicroCopy("downloadList.clear")}
            className={styles["clear-downloads"]}
          />
          <DownloadList.Button
            label={`${getMicroCopy("downloadList.download")} ({{count}})`}
            onClick={(list, token) => onDownloadClick(list, token, resetList)}
          />
        </GoogleReCaptchaProvider>
      )}
    </div>
  );
};

export default DocumentResultsFooter;
