import {
  Button,
  ButtonProps,
  ClickableAction,
  Icon,
  iconMap,
  Typography
} from "@bmi/components";
import { GetApp } from "@material-ui/icons";
import classnames from "classnames";
import filesize from "filesize";
import React from "react";
import { PseudoZipPIMDocument } from "../types/pim";
import { getDownloadLink } from "../utils/client-download";
import withGTM from "../utils/google-tag-manager";
import {
  Document,
  FileDownloadButtonProps,
  mapAssetToFileDownload,
  MultipleAssetToFileDownload
} from "./DocumentSimpleTableResults";
import fileIconsMap from "./FileIconsMap";
import styles from "./styles/DocumentSimpleTableResults.module.scss";
import stylesMobile from "./styles/DocumentSimpleTableResultsMobile.module.scss";

type ListProps = {
  documents: Document[];
};

// const isLinkDocument = (document: Document): boolean =>
//   "isLinkDocument" in document && document.isLinkDocument;

const GTMButton = withGTM<
  ButtonProps & {
    action?: ClickableAction;
  }
>(Button);

const MultipleDocumentsToZipFile = ({
  document
}: {
  document: PseudoZipPIMDocument;
}) => {
  return (
    <div className={stylesMobile["list-item"]}>
      <div className={stylesMobile["list-title-row"]}>
        <div className={stylesMobile["list-icon"]}>
          <Icon
            // eslint-disable-next-line security/detect-object-injection
            source={iconMap.FileZIP}
            className={styles["download-icon"]}
          />
        </div>
        <Typography className={stylesMobile["document-title"]}>
          {document.assetType.name}
        </Typography>
      </div>
      <div className={stylesMobile["list-download-row"]}>
        <Typography className={stylesMobile["document-type"]}>
          {document.assetType.name}
        </Typography>
        <MultipleAssetToFileDownload document={document} isMobile />
      </div>
    </div>
  );
};

const ListItem = ({ asset }: { asset: FileDownloadButtonProps }) => {
  return (
    <div className={stylesMobile["list-item"]}>
      <div className={stylesMobile["list-title-row"]}>
        {!asset.isLinkDocument && (
          <div className={stylesMobile["list-icon"]}>
            <Icon
              source={fileIconsMap[asset.format] || iconMap.External}
              className={styles["download-icon"]}
            />
          </div>
        )}
        <Typography className={stylesMobile["document-title"]}>
          {asset.title}
        </Typography>
      </div>
      <div className={stylesMobile["list-download-row"]}>
        <Typography className={stylesMobile["document-type"]}>
          {asset.assetTypeName}
        </Typography>
        {!asset.isLinkDocument ? (
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
            size="small"
            action={{
              model: "htmlLink",
              href: asset.url,
              target: "_blank",
              rel: "noopener noreferrer"
            }}
          >
            <Icon
              source={iconMap.ExternalMobile}
              className={stylesMobile["external-link-icon"]}
            />
          </Button>
        )}
      </div>
    </div>
  );
};

export const DocumentSimpleTableResultsMobile = ({
  documents
}: ListProps): React.ReactElement => {
  const list = documents.map((document, index) => {
    if (document.__typename === "PIMDocumentWithPseudoZip") {
      const key = `${document.__typename}-${index}`;
      return <MultipleDocumentsToZipFile key={key} document={document} />;
    }
    return (
      <ListItem asset={mapAssetToFileDownload(document)} key={document.id} />
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
