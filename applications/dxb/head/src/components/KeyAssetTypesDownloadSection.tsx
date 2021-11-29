import React from "react";
import axios from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { GetApp, Folder } from "@material-ui/icons";
import Button, { ButtonProps, ClickableAction } from "@bmi/button";
import { getDownloadLink, downloadAs } from "../utils/client-download";
import withGTM from "../utils/google-tag-manager";
import { DocumentData as SDPDocumentData } from "../templates/systemDetails/types";

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

const GTMButton =
  withGTM<
    ButtonProps & {
      action?: ClickableAction;
    }
  >(Button);

export const handleDownloadClick = async (
  list: CommonData[],
  token: string
) => {
  const [currentTime] = new Date().toJSON().replace(/-|:|T/g, "").split(".");

  if (list.length === 0) {
    return () => {};
  }

  if (process.env.GATSBY_PREVIEW) {
    alert("You cannot download documents on the preview enviornment.");

    return () => {};
  }

  try {
    if (!process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT) {
      throw Error(
        "`GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT` missing in environment config"
      );
    }

    const documents = list.map((item) => {
      const { assetType, ...rest } = item;
      return rest;
    });

    const response = await axios.post(
      process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT,
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
    const { url, assetType, realFileName } = data;

    return {
      href: url,
      name: realFileName,
      assetType: assetType.name
    };
  }

  if (data.__typename === "PIMLinkDocument") {
    const { url, assetType, title } = data;

    return {
      href: url,
      name: title,
      assetType: assetType.name
    };
  }

  const {
    asset: { file },
    assetType
  } = data;

  return {
    href: file.url,
    name: file.fileName,
    assetType: assetType.name
  };
};

const KeyAssetTypesDownloadSection = (props: Props) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { assetTypes, documents } = props;

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
              startIcon={mappedDocuments.length === 1 ? <GetApp /> : <Folder />}
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

                  handleDownloadClick(mappedDocuments, token);
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
