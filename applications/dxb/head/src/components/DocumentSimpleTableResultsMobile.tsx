import { Button, ButtonProps, ClickableAction } from "@bmi/components";
import { Icon, iconMap } from "@bmi/components";
import { Typography } from "@bmi/components";
import { GetApp } from "@material-ui/icons";
import filesize from "filesize";
import React from "react";
import classnames from "classnames";
import { Data as ContentfulDocumentData } from "../components/Document";
import withGTM from "../utils/google-tag-manager";
import { getDownloadLink } from "../utils/client-download";
import {
  Document,
  FileDownloadButtonProps,
  mapAssetToFileDownload,
  MultipleAssetToFileDownload
} from "./DocumentSimpleTableResults";
import fileIconsMap from "./FileIconsMap";
import stylesMobile from "./styles/DocumentSimpleTableResultsMobile.module.scss";
import styles from "./styles/DocumentSimpleTableResults.module.scss";
import { PIMDocumentData, PIMLinkDocumentData } from "./types/PIMDocumentBase";

type ListProps = {
  documents: Document[];
  documentsByAssetType?: [string, (PIMDocumentData | PIMLinkDocumentData)[]][];
};

const GTMButton = withGTM<
  ButtonProps & {
    action?: ClickableAction;
  }
>(Button);

export const isPIMDocumentData = (
  doc: PIMLinkDocumentData | PIMDocumentData
): doc is PIMDocumentData =>
  doc.__typename === "PIMDocument" && "fileSize" in doc;

export const isPIMLinkDocumentData = (
  doc: PIMLinkDocumentData | PIMDocumentData | Document | ContentfulDocumentData
): doc is PIMLinkDocumentData =>
  doc.__typename === "PIMLinkDocument" ||
  (doc.__typename === "PIMDocument" && !("fileSize" in doc));

const MultipleDocumentsToZipFile = ({
  documents
}: {
  documents: PIMDocumentData[];
}) => {
  const document = documents[0];
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
          {document.title}
        </Typography>
      </div>
      <div className={stylesMobile["list-download-row"]}>
        <Typography className={stylesMobile["document-type"]}>
          {document.assetType.name}
        </Typography>
        <MultipleAssetToFileDownload assets={documents} isMobile />
      </div>
    </div>
  );
};

const ListItem = ({
  document,
  asset
}: {
  document: Document;
  asset: FileDownloadButtonProps;
}) => {
  return (
    <div className={stylesMobile["list-item"]}>
      <div className={stylesMobile["list-title-row"]}>
        <div className={stylesMobile["list-icon"]}>
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
};

export const DocumentSimpleTableResultsMobile = ({
  documents,
  documentsByAssetType
}: ListProps): React.ReactElement => {
  let list;

  if (documentsByAssetType) {
    list = documentsByAssetType.map(([assetCode, assets], index) => {
      const key = `${
        assets.find(({ assetType }) => assetType.code)?.assetType.code
      }-${index}`;

      const filteredZipDocuments: PIMDocumentData[] = assets
        .filter(isPIMDocumentData)
        .filter((asset) => asset.extension === "zip");

      const filteredLinkDocuments: PIMLinkDocumentData[] = assets
        .filter(isPIMLinkDocumentData)
        .map((asset) => ({ ...asset, __typename: "PIMLinkDocument" }));
      const filteredDocuments: PIMDocumentData[] =
        assets.filter(isPIMDocumentData);

      return (
        <>
          {filteredLinkDocuments.length > 0 &&
            filteredLinkDocuments.map((pimDocument, index) => {
              const newKey = key + index;

              return (
                <ListItem
                  key={newKey}
                  document={{ ...pimDocument, __typename: "PIMLinkDocument" }}
                  asset={undefined}
                />
              );
            })}
          {filteredZipDocuments.length > 0 &&
            filteredZipDocuments.map((zipDocument, index) => {
              const newKey = key + index;
              return (
                <ListItem
                  key={newKey}
                  document={zipDocument}
                  asset={mapAssetToFileDownload(zipDocument)}
                />
              );
            })}

          {filteredDocuments.length > 0 ? (
            filteredDocuments.length === 1 ? (
              <ListItem
                document={filteredDocuments[0]}
                asset={mapAssetToFileDownload(filteredDocuments[0])}
              />
            ) : (
              <MultipleDocumentsToZipFile documents={filteredDocuments} />
            )
          ) : null}
        </>
      );
    });

    //single row for multiple document
  } else {
    list = documents.map((document) => {
      if (isPIMLinkDocumentData(document)) {
        document = { ...document, __typename: "PIMLinkDocument" };
      }
      const asset =
        document.__typename !== "PIMLinkDocument"
          ? mapAssetToFileDownload(document)
          : undefined;

      return <ListItem document={document} asset={asset} key={document.id} />;
    });
  }

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
