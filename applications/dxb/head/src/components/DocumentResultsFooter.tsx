import {
  Button,
  ButtonProps,
  DownloadList,
  DownloadListContext,
  Pagination
} from "@bmi-digital/components";
import { useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import classnames from "classnames";
import fetch, { Response } from "node-fetch";
import React, { useContext } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { QA_AUTH_TOKEN } from "../constants/cookieConstants";
import { microCopy } from "../constants/microCopies";
import { EnvConfig, useConfig } from "../contexts/ConfigProvider";
import { DocumentResultData } from "../templates/documentLibrary/components/DocumentResults";
import { downloadAs, getDownloadLink } from "../utils/client-download";
import { devLog } from "../utils/devLog";
import getCookie from "../utils/getCookie";
import withGTM from "../utils/google-tag-manager";
import createAssetFileCountMap, {
  AssetUniqueFileCountMap,
  generateFileNamebyTitle
} from "./DocumentFileUtils";
import RecaptchaPrivacyLinks from "./RecaptchaPrivacyLinks";
import { useSiteContext } from "./Site";
import styles from "./styles/DocumentResultsFooter.module.scss";

const PREFIX = "docResultsFooterStyles";
const classes = {
  paginationRoot: `${PREFIX}-paginationRoot`
};

const StyledPagination = styled(Pagination)(({ theme }) => ({
  [`&.${classes.paginationRoot}`]: {
    "& ul": {
      justifyContent: "flex-end"
    }
  }
}));

type Props = {
  page: number;
  count: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  isDownloadButton?: boolean;
};

const GTMButton = withGTM<ButtonProps>(Button);

export const handleDownloadClick = async (
  list: Record<string, any>,
  config: EnvConfig["config"],
  token?: string,
  callback?: () => void,
  qaAuthToken?: string
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

    let headers: HeadersInit = {
      "Content-Type": "application/json",
      "X-Recaptcha-Token": token
    };
    if (qaAuthToken) {
      headers = { ...headers, authorization: `Bearer ${qaAuthToken}` };
    }
    const response: Response = await fetch(documentDownloadEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ documents })
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();

    await downloadAs(data.url, `BMI_${currentTime}.zip`);

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
  const { getMicroCopy } = useSiteContext();
  const { resetList, list } = useContext(DownloadListContext);
  const { config } = useConfig();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const qaAuthToken = getCookie(QA_AUTH_TOKEN);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const displayPagination = count > 1;

  return (
    <div
      className={styles["DocumentResultsFooter"]}
      data-testid="document-results-footer"
    >
      {displayPagination && (
        <StyledPagination
          page={page}
          onChange={onPageChange}
          count={count}
          className={classnames(styles["pagination"], classes.paginationRoot)}
        />
      )}
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
              const token = qaAuthToken ? undefined : await executeRecaptcha();
              await handleDownloadClick(
                list,
                config,
                token,
                resetList,
                qaAuthToken
              );
            }}
            data-testid="document-table-download-button"
          />
          <RecaptchaPrivacyLinks />
        </>
      )}
    </div>
  );
};

export default DocumentResultsFooter;
