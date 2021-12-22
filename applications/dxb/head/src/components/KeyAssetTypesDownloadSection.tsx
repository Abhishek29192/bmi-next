import React from "react";
import axios from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Button, ButtonProps, ClickableAction } from "@bmi/components";
import { GetApp } from "@material-ui/icons";
import { getDownloadLink, downloadAs } from "../utils/client-download";
import withGTM from "../utils/google-tag-manager";
import { DocumentData as SDPDocumentData } from "../templates/systemDetails/types";
import { useConfig } from "../contexts/ConfigProvider";
import { convertStrToBool } from "../utils/convertStrToBool";
import Icon from "./Icon";

import { PIMDocumentData, PIMLinkDocumentData } from "./types/PIMDocumentBase";
import { Data as DocumentData } from "./Document";

import styles from "./styles/KeyAssetTypesDownloadSection.module.scss";

export type Data =
  | PIMDocumentData
  | DocumentData
  | PIMLinkDocumentData
  | SDPDocumentData;

type Props = {
  assetTypes: string[];
  documents: Data[];
};

type CommonData = {
  href: string;
  name: string;
  assetType: string;
};

const GTMButton = withGTM<
  ButtonProps & {
    action?: ClickableAction;
  }
>(Button);

export const handleDownloadClick = async (
  list: CommonData[],
  token: string,
  config: Record<string, string>
) => {
  const { isPreviewMode, documentDownloadEndpoint } = config;
  const [currentTime] = new Date().toJSON().replace(/-|:|T/g, "").split(".");

  if (list.length === 0) {
    return () => {
      // no-op
    };
  }

  if (convertStrToBool(isPreviewMode)) {
    alert("You cannot download documents on the preview enviornment.");

    return () => {
      // no-op
    };
  }

  try {
    if (!documentDownloadEndpoint) {
      throw Error(
        "`GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT` missing in environment config"
      );
    }

    const documents = list.map((item) => {
      const { assetType, ...rest } = item;
      return rest;
    });

    const response = await axios.post(
      documentDownloadEndpoint,
      { documents },
      { responseType: "text", headers: { "X-Recaptcha-Token": token } }
    );

    await downloadAs(response.data.url, `BMI_${currentTime}.zip`);
  } catch (error) {
    console.error("KeyAssetTypesDownloadSection", error); // eslint-disable-line
  }
};

export const mapAssetToCommonData = (data: Data): CommonData => {
  if (data.__typename === "PIMDocument") {
    const { url, assetType, title, extension } = data;

    return {
      href: url,
      name: `${title}.${extension}`,
      assetType: assetType.name
    };
  }

  if (data.__typename === "PIMLinkDocument") {
    const { url, assetType, title } = data;

    return {
      href: url,
      name: `${title}.${url.split(".").pop()}`,
      assetType: assetType.name
    };
  }

  const {
    asset: { file },
    assetType,
    title
  } = data;

  return {
    href: file.url,
    name: `${title}.${file.fileName.split(".").pop()}`,
    assetType: assetType.name
  };
};

const KeyAssetTypesDownloadSection = (props: Props) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { assetTypes, documents } = props;
  const { config } = useConfig();

  return (
    <div className={styles["container"]}>
      {assetTypes.map((assetType) => {
        const mappedDocuments = documents
          .filter((document) => document.assetType.pimCode === assetType)
          .map((document) => mapAssetToCommonData(document));

        if (!mappedDocuments.length) return null;

        return (
          <div key={assetType}>
            <GTMButton
              gtm={{
                id: "download1",
                label: "Download",
                action: JSON.stringify(mappedDocuments.map((item) => item.href))
              }}
              variant="text"
              startIcon={
                mappedDocuments.length === 1 ? (
                  <GetApp />
                ) : (
                  <Icon name="FolderZip" />
                )
              }
              action={
                mappedDocuments.length === 1 && {
                  model: "download",
                  href: getDownloadLink(mappedDocuments[0].href)
                }
              }
              onClick={
                mappedDocuments.length > 1 &&
                (async () => {
                  const token = await executeRecaptcha();

                  handleDownloadClick(mappedDocuments, token, config);
                })
              }
            >
              {mappedDocuments[0].assetType}
            </GTMButton>
          </div>
        );
      })}
    </div>
  );
};

export default KeyAssetTypesDownloadSection;
