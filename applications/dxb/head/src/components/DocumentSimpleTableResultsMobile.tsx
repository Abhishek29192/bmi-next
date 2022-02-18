import { Button, ButtonProps, ClickableAction } from "@bmi-digital/components";
import { Icon, iconMap } from "@bmi-digital/components";
import { Typography } from "@bmi-digital/components";
import { GetApp } from "@material-ui/icons";
import filesize from "filesize";
import React from "react";
import classnames from "classnames";
import withGTM from "../utils/google-tag-manager";
import { getDownloadLink } from "../utils/client-download";
import { Document, mapAssetToFileDownload } from "./DocumentSimpleTableResults";
import fileIconsMap from "./FileIconsMap";
import stylesMobile from "./styles/DocumentSimpleTableResultsMobile.module.scss";
import styles from "./styles/DocumentSimpleTableResults.module.scss";

type ListProps = {
  documents: Document[];
};

const GTMButton = withGTM<
  ButtonProps & {
    action?: ClickableAction;
  }
>(Button);

export const DocumentSimpleTableResultsMobile = ({ documents }: ListProps) => {
  const list = documents.map((document) => {
    const asset =
      document.__typename !== "PIMLinkDocument"
        ? mapAssetToFileDownload(document)
        : undefined;

    return (
      <div key={document.id} className={stylesMobile["list-item"]}>
        <div className={stylesMobile["list-title-row"]}>
          <div className={stylesMobile["list-icon"]}>
            {document.__typename !== "PIMLinkDocument" ? (
              <Icon
                source={fileIconsMap[asset.format] || iconMap.External}
                className={styles["download-icon"]}
              />
            ) : (
              <Icon
                source={iconMap.External}
                className={styles["external-link-icon"]}
              />
            )}
          </div>
          <Typography className={stylesMobile["document-title"]}>
            {document.title}
          </Typography>
        </div>
        <div className={stylesMobile["list-download-row"]}>
          <Typography className={stylesMobile["document-type"]}>
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
                href: getDownloadLink(asset.url)
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
                className={stylesMobile["external-link-icon"]}
              />
            </Button>
          )}
        </div>
      </div>
    );
  });

  return (
    <div
      className={classnames(
        stylesMobile["DocumentSimpleTableResultsMobile"],
        styles["DocumentSimpleTableResults"]
      )}
    >
      {list}
    </div>
  );
};
