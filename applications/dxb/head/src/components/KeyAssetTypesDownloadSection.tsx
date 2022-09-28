import { Button, ButtonProps, ClickableAction } from "@bmi/components";
import { GetApp } from "@material-ui/icons";
import fetch, { Response } from "node-fetch";
import React from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useConfig } from "../contexts/ConfigProvider";
import { KeyAssetDocument, ProductDocument } from "../types/pim";
import { downloadAs, getDownloadLink } from "../utils/client-download";
import { devLog } from "../utils/devLog";
import withGTM from "../utils/google-tag-manager";
import Icon from "./Icon";
import styles from "./styles/KeyAssetTypesDownloadSection.module.scss";

type Props = {
  keyAssetDocuments: KeyAssetDocument[];
};

const GTMButton = withGTM<
  ButtonProps & {
    action?: ClickableAction;
  }
>(Button);

const handleDownloadClick = async (
  list: readonly ProductDocument[],
  token: string,
  documentDownloadEndpoint: string
) => {
  const [currentTime] = new Date().toJSON().replace(/[-:T]/g, "").split(".");

  try {
    const documents = list.map((item) => ({
      href: item.url,
      name: item.title
    }));

    const response: Response = await fetch(documentDownloadEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Recaptcha-Token": token
      },
      body: JSON.stringify({ documents })
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();

    await downloadAs(data.url, `BMI_${currentTime}.zip`);
  } catch (error) {
    devLog("KeyAssetTypesDownloadSection", error);
  }
};

const KeyAssetTypesDownloadSection = ({ keyAssetDocuments }: Props) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { config } = useConfig();

  return (
    <div className={styles["container"]}>
      {keyAssetDocuments.map(({ assetType, documents }) => {
        return (
          <div key={assetType}>
            <GTMButton
              gtm={{
                id: "download1",
                label: "Download",
                action: JSON.stringify(documents.map((item) => item.url))
              }}
              variant="text"
              startIcon={
                documents.length === 1 ? <GetApp /> : <Icon name="FolderZip" />
              }
              action={
                documents.length === 1
                  ? {
                      model: "download",
                      href: getDownloadLink(documents[0].url)
                    }
                  : undefined
              }
              onClick={
                documents.length > 1
                  ? async () => {
                      const { isPreviewMode, documentDownloadEndpoint } =
                        config;

                      if (isPreviewMode) {
                        alert(
                          "You cannot download documents on the preview environment."
                        );
                        return;
                      }

                      if (!documentDownloadEndpoint) {
                        console.error(
                          "`GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT` missing in environment config"
                        );
                        return;
                      }

                      const token = await executeRecaptcha();
                      await handleDownloadClick(
                        documents,
                        token,
                        documentDownloadEndpoint
                      );
                    }
                  : undefined
              }
              data-testid={`${assetType}Download`}
            >
              {documents[0].assetType.name}
            </GTMButton>
          </div>
        );
      })}
    </div>
  );
};

export default KeyAssetTypesDownloadSection;
