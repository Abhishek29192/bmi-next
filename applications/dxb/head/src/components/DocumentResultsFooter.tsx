import Button, { ButtonProps } from "@bmi/button";
import DownloadList, { DownloadListContext } from "@bmi/download-list";
import Pagination from "@bmi/pagination";
import axios from "axios";
import { flatten } from "lodash";
import React, { useContext } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { downloadAs } from "../utils/client-download";
import withGTM from "../utils/google-tag-manager";
import createAssetFileCountMap, {
  generateFileNamebyTitle,
  AssetUniqueFileCountMap
} from "./DocumentFileUtils";
import { useSiteContext } from "./Site";
import RecaptchaPrivacyLinks from "./RecaptchaPrivacyLinks";
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

const GTMButton = withGTM<ButtonProps>(Button);

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

  if (process.env.GATSBY_PREVIEW) {
    alert("You cannot download documents on the preview enviornment.");
    callback();

    return () => {};
  }

  try {
    if (!process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT) {
      throw Error(
        "`GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT` missing in environment config"
      );
    }
    const assets = flatten(listValues);
    const assetFileCountMap: AssetUniqueFileCountMap =
      createAssetFileCountMap(assets);
    const documents = assets.map(
      ({ __typename, asset, extension, title }, index) => {
        if (__typename === "SDPDocument") {
          return {
            href: asset.file.url,
            name: asset.file.fileName
          };
        }
        return {
          href:
            __typename === "ContentfulDocument"
              ? `https:${asset.file.url}`
              : url,
          name:
            __typename === "ContentfulDocument"
              ? `${title}.${asset.file.fileName.split(".").pop()}`
              : generateFileNamebyTitle(
                  assetFileCountMap,
                  title,
                  extension,
                  index
                )
        };
      }
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
  const { getMicroCopy } = useSiteContext();
  const { resetList, list } = useContext(DownloadListContext);
  const { executeRecaptcha } = useGoogleReCaptcha();

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
            component={(props: ButtonProps) => (
              <GTMButton
                gtm={{
                  id: "download3-button1",
                  label: props.children[0],
                  action: JSON.stringify(
                    Object.values(list).map((item) =>
                      Array.isArray(item) ? item[0].url : item.url
                    )
                  )
                }}
                {...props}
              />
            )}
            label={`${getMicroCopy("downloadList.download")} ({{count}})`}
            onClick={async (list) => {
              const token = await executeRecaptcha();

              onDownloadClick(list, token, resetList);
            }}
          />
          <RecaptchaPrivacyLinks />
        </>
      )}
    </div>
  );
};

export default DocumentResultsFooter;
