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
import { useStyles as useStylesMobile } from "./styles/DocumentSimpleTableResultsMobileStyles";
import { useStyles } from "./styles/DocumentSimpleTableResultsStyles";

type ListProps = {
  documents: readonly Document[];
};

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
  const classesMobile = useStylesMobile();
  const classes = useStyles();
  return (
    <div className={classesMobile.listItem}>
      <div className={classesMobile.listTitleRow}>
        <div className={classesMobile.listIcon}>
          <Icon
            // eslint-disable-next-line security/detect-object-injection
            source={iconMap.FileZIP}
            className={classnames(classes.downloadIcon, "download-icon")}
          />
        </div>
        <Typography className={classesMobile.documentTitle}>
          {document.assetType.name}
        </Typography>
      </div>
      <div className={classesMobile.listDownloadRow}>
        <Typography className={classesMobile.documentType}>
          {document.assetType.name}
        </Typography>
        <MultipleAssetToFileDownload document={document} isMobile />
      </div>
    </div>
  );
};

const ListItem = ({ asset }: { asset: FileDownloadButtonProps }) => {
  const classesMobile = useStylesMobile();
  const classes = useStyles();
  return (
    <div className={classesMobile.listItem}>
      <div className={classesMobile.listTitleRow}>
        {!asset.isLinkDocument && (
          <div className={classesMobile.listIcon}>
            <Icon
              source={fileIconsMap[asset.format] || iconMap.External}
              className={classnames(classes.downloadIcon, "download-icon")}
            />
          </div>
        )}
        <Typography className={classesMobile.documentTitle}>
          {asset.title}
        </Typography>
      </div>
      <div className={classesMobile.listDownloadRow}>
        <Typography className={classesMobile.documentType}>
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
              className={classesMobile.externalLinkIcon}
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
  const classesMobile = useStylesMobile();
  const classes = useStyles();
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
    <div className={classnames(classesMobile.root, classes.root)}>{list}</div>
  );
};
