import {
  Button,
  ButtonProps,
  DownloadList,
  DownloadListContext,
  Pagination
} from "@bmi/components";
import { useMediaQuery } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import axios from "axios";
import classnames from "classnames";
import React, { useContext } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { microCopy } from "../constants/microCopies";
import { EnvConfig, useConfig } from "../contexts/ConfigProvider";
import { DocumentResultData } from "../templates/documentLibrary/components/DocumentResults";
import { downloadAs, getDownloadLink } from "../utils/client-download";
import { devLog } from "../utils/devLog";
import withGTM from "../utils/google-tag-manager";
import createAssetFileCountMap, {
  AssetUniqueFileCountMap,
  generateFileNamebyTitle
} from "./DocumentFileUtils";
import RecaptchaPrivacyLinks from "./RecaptchaPrivacyLinks";
import { useSiteContext } from "./Site";
import styles from "./styles/DocumentResultsFooter.module.scss";

export const useGlobalDocResFooterStyles = makeStyles(
  () => ({
    paginationRoot: {
      "& ul": {
        justifyContent: "flex-end"
      }
    }
  }),
  { classNamePrefix: "docResultsFooterStyles" }
);

type Props = {
  page: number;
  count: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  isDownloadButton?: boolean;
};

const GTMButton = withGTM<ButtonProps>(Button);

export const handleDownloadClick = async (
  list: Record<string, any>,
  token: string,
  config: EnvConfig["config"],
  callback?: () => void
) => {
  const { isPreviewMode, documentDownloadEndpoint } = config;
  const listValues = Object.values(list).filter(Boolean);
  const [currentTime] = new Date().toJSON().replace(/-|:|T/g, "").split(".");

  if (listValues.length === 0) {
    return;
  }

  if (isPreviewMode) {
    alert("You cannot download documents on the preview enviornment.");
    callback();

    return;
  }

  try {
    if (!documentDownloadEndpoint) {
      throw Error(
        "`GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT` missing in environment config"
      );
    }
    const assets = listValues.flat();
    const assetFileCountMap: AssetUniqueFileCountMap =
      createAssetFileCountMap(assets);
    const documents = assets.map(
      ({ __typename, asset, extension, title, url }, index) => {
        if (__typename === "PIMSystemDocument") {
          return {
            href: asset.file.url,
            name: asset.file.fileName
          };
        }
        return {
          href:
            __typename === "ContentfulDocument"
              ? getDownloadLink(asset.file.url)
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
      documentDownloadEndpoint,
      { documents: documents },
      { responseType: "text", headers: { "X-Recaptcha-Token": token } }
    );

    await downloadAs(response.data.url, `BMI_${currentTime}.zip`);

    if (callback) {
      callback();
    }
  } catch (error) {
    devLog(`DocumentResults: ${error.message}`);
  }
};

const extractUrl = (el) => {
  return el.__typename === "PIMDocument" ||
    el.__typename === "PIMSystemDocument"
    ? el.url
    : el.asset.file.url;
};

const getListOfUrl = (item: DocumentResultData[]) => {
  return item
    .map((el) => {
      return extractUrl(el);
    })
    .join(",");
};

const getAction = (list: Record<string, DocumentResultData>) => {
  return JSON.stringify(
    Object.values(list)
      .map((item) => {
        if (item) {
          if (Array.isArray(item)) {
            return getListOfUrl(item);
          } else {
            return extractUrl(item);
          }
        }
      })
      .filter(Boolean)
  );
};

const DocumentResultsFooter = ({
  page,
  count,
  onPageChange,
  isDownloadButton = true
}: Props) => {
  const globalClasses = useGlobalDocResFooterStyles();
  const { getMicroCopy } = useSiteContext();
  const { resetList, list } = useContext(DownloadListContext);
  const { config } = useConfig();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div className={styles["DocumentResultsFooter"]}>
      <Pagination
        page={page}
        onChange={onPageChange}
        count={count}
        className={classnames(
          styles["pagination"],
          globalClasses.paginationRoot
        )}
      />
      {isDownloadButton && !isMobile && (
        <>
          <DownloadList.Clear
            label={getMicroCopy(microCopy.DOWNLOAD_LIST_CLEAR)}
            className={styles["clear-downloads"]}
          />
          <DownloadList.Button
            component={(props: ButtonProps) => (
              <GTMButton
                gtm={{
                  id: "download3-button1",
                  label: props.children[0],
                  action: getAction(list)
                }}
                {...props}
              />
            )}
            label={`${getMicroCopy(
              microCopy.DOWNLOAD_LIST_DOWNLOAD
            )} ({{count}})`}
            onClick={async (list) => {
              const token = await executeRecaptcha();

              await handleDownloadClick(list, token, config, resetList);
            }}
          />
          <RecaptchaPrivacyLinks />
        </>
      )}
    </div>
  );
};

export default DocumentResultsFooter;
