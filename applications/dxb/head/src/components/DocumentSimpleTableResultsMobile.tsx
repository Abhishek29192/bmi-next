import Button, { ButtonProps, ClickableAction } from "@bmi/button";
import Icon, { iconMap } from "@bmi/icon";
import Typography from "@bmi/typography";
import { GetApp } from "@material-ui/icons";
import filesize from "filesize";
import React from "react";
import withGTM from "../utils/google-tag-manager";
import { Document, mapAssetToFileDownload } from "./DocumentSimpleTableResults";
import fileIconsMap from "./FileIconsMap";
import styles from "./styles/DocumentSimpleTableResults.module.scss";

type ListProps = {
  documents: Document[];
};

const GTMButton =
  withGTM<
    ButtonProps & {
      action?: ClickableAction;
    }
  >(Button);

export const DocumentSimpleTableResultsMobile = ({ documents }: ListProps) => {
  const list = documents.map((document) => {
    const asset =
      document.__typename !== "PIMLinkDocument"
        ? mapAssetToFileDownload(document)
        : null;

    return (
      <div key={document.id} className={styles["list-item"]}>
        <div className={styles["list-title-row"]}>
          <div className={styles["list-icon"]}>
            {document.__typename !== "PIMLinkDocument" ? (
              <Icon
                source={fileIconsMap[asset.format]}
                className={styles["download-icon"]}
              />
            ) : (
              <Icon
                source={iconMap.External}
                className={styles["external-link-icon"]}
              />
            )}
          </div>
          <Typography className={styles["document-title"]}>
            {document.title}
          </Typography>
        </div>
        <div className={styles["list-download-row"]}>
          <Typography className={styles["document-type"]}>
            {document.assetType.name}
          </Typography>
          {document.__typename !== "PIMLinkDocument" ? (
            <GTMButton
              gtm={{
                id: "download1",
                label: "Download",
                action: asset.url
              }}
              variant="text"
              endIcon={<GetApp />}
              action={{
                model: "download",
                href: `https:${asset.url.replace(/https?:/, "")}`
              }}
            >
              {filesize(asset.size)}
            </GTMButton>
          ) : (
            <Button
              isIconButton
              variant="text"
              action={{
                model: "htmlLink",
                href: document.url,
                target: "_blank",
                rel: "noopener noreferrer"
              }}
            >
              <Icon
                source={iconMap.External}
                className={styles["external-link-icon"]}
              />
            </Button>
          )}
        </div>
      </div>
    );
  });

  return <div className={styles["DocumentSimpleTableResults"]}>{list}</div>;
};
