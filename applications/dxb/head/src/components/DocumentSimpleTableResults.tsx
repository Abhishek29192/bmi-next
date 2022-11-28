import logger from "@bmi-digital/functions-logger";
import {
  Button,
  ButtonProps,
  ClickableAction,
  DownloadList,
  DownloadListContext,
  Icon,
  iconMap,
  Table
} from "@bmi/components";
import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { GetApp } from "@material-ui/icons";
import classnames from "classnames";
import filesize from "filesize";
import fetch, { Response } from "node-fetch";
import React, { useContext } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {
  ContentfulDocument as EsContentfulDocument,
  PimProductDocument as EsPimDocument,
  PimSystemDocument as EsPimSystemDocument
} from "@bmi/elasticsearch-types";
import { microCopy } from "../constants/microCopies";
import { useConfig } from "../contexts/ConfigProvider";
import { ContentfulDocument } from "../types/Document";
import {
  ProductDocument as FsPimDocument,
  PseudoZipPIMDocument,
  SystemDocument as FsPimSystemDocument
} from "../types/pim";
import { downloadAs, getDownloadLink } from "../utils/client-download";
import withGTM from "../utils/google-tag-manager";
import createAssetFileCountMap, {
  AssetUniqueFileCountMap,
  generateFilenameByRealFileName,
  generateFileNamebyTitle
} from "./DocumentFileUtils";
import { DocumentSimpleTableResultsMobile } from "./DocumentSimpleTableResultsMobile";
import fileIconsMap from "./FileIconsMap";
import { useSiteContext } from "./Site";
import styles from "./styles/DocumentSimpleTableResults.module.scss";

export type AvailableHeader =
  | "typeCode"
  | "type"
  | "name"
  | "title"
  | "download"
  | "add";

export type Document =
  | ContentfulDocument
  | FsPimDocument
  | FsPimSystemDocument
  | PseudoZipPIMDocument
  | EsContentfulDocument
  | EsPimDocument
  | EsPimSystemDocument;

export type Props = {
  documents: readonly Document[];
  headers?: AvailableHeader[];
};

const GTMButton = withGTM<
  ButtonProps & {
    action?: ClickableAction;
  }
>(Button);

const isLinkDocument = (document: Document): boolean =>
  "isLinkDocument" in document && document.isLinkDocument;

const getUniqueId = (document: Document): string =>
  `${document.id}-${document.title}`.replace(/ /g, "_");

const getDocument = (document: Document, headers: AvailableHeader[]) => {
  const { getMicroCopy } = useSiteContext();
  const { __typename } = document;
  return headers.map((header) => {
    const key = `${__typename}-body-${header}`;

    if (header === "typeCode") {
      return (
        <Table.Cell className={styles["table-cell"]} key={key}>
          <abbr title={document.assetType.name}>{document.assetType.code}</abbr>
        </Table.Cell>
      );
    }

    if (header === "type") {
      return (
        <Table.Cell className={styles["table-cell"]} key={key}>
          {document.assetType.name}
        </Table.Cell>
      );
    }

    if (header === "name") {
      if (
        document.__typename === "PIMDocument" ||
        document.__typename === "PIMSystemDocument"
      ) {
        return (
          <Table.Cell className={styles["table-cell"]} key={key}>
            {document.title}
          </Table.Cell>
        );
      }
    }

    if (header === "title") {
      return (
        <Table.Cell className={styles["title-table-cell"]} key={key}>
          <p className={styles["title"]}>{document.title}</p>
        </Table.Cell>
      );
    }

    if (header === "download") {
      return (
        <Table.Cell className={styles["table-cell"]} align="left" key={key}>
          {!isLinkDocument(document) ? (
            document.__typename === "PIMDocumentWithPseudoZip" ? (
              <MultipleAssetToFileDownload document={document} />
            ) : (
              <FileDownloadButton {...mapAssetToFileDownload(document)} />
            )
          ) : (
            <Button
              isIconButton
              variant="text"
              action={{
                model: "htmlLink",
                href: (document as FsPimDocument).url,
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
        </Table.Cell>
      );
    }

    if (header === "add") {
      return !(document.__typename === "PIMDocumentWithPseudoZip") ? (
        <Table.Cell className={styles["table-cell"]} align="center" key={key}>
          {!isLinkDocument(document) ? (
            <DownloadList.Checkbox
              name={getUniqueId(document)}
              maxLimitReachedLabel={getMicroCopy(
                microCopy.DOCUMENTS_DOWNLOAD_MAX_REACHED
              )}
              ariaLabel={`${getMicroCopy(
                microCopy.DOCUMENT_LIBRARY_DOWNLOAD
              )} ${document.title}`}
              value={document}
              fileSize={document[typenameToSizeMap[document.__typename]] || 0}
            />
          ) : (
            <span className={styles["no-document-icon"]}>-</span>
          )}
        </Table.Cell>
      ) : (
        <Table.Cell className={styles["table-cell"]} align="center" key={key}>
          <DownloadList.Checkbox
            name={getUniqueId(document)}
            maxLimitReachedLabel={getMicroCopy(
              microCopy.DOCUMENTS_DOWNLOAD_MAX_REACHED
            )}
            ariaLabel={`${getMicroCopy(microCopy.DOCUMENT_LIBRARY_DOWNLOAD)} ${
              document.assetType.name
            }`}
            value={document.documentList}
            fileSize={document.fileSize}
          />
        </Table.Cell>
      );
    }

    return (
      <Table.Cell className={styles["table-cell"]} key={key}>
        n/d
      </Table.Cell>
    );
  });
};

export const mapAssetToFileDownload = (
  data:
    | ContentfulDocument
    | FsPimDocument
    | FsPimSystemDocument
    | EsContentfulDocument
    | EsPimDocument
    | EsPimSystemDocument
): FileDownloadButtonProps => {
  if (
    data.__typename === "PIMDocument" ||
    data.__typename === "PIMSystemDocument"
  ) {
    const { url, format, fileSize: size } = data;

    return {
      url,
      format,
      size,
      assetTypeName: data.assetType.name,
      title: data.title,
      isLinkDocument: data.isLinkDocument
    };
  }

  const {
    asset: { file }
  } = data;

  return {
    url: file.url,
    format: file.contentType,
    size: file.details.size,
    assetTypeName: data.assetType.name,
    title: data.title,
    isLinkDocument: false
  };
};

export const MultipleAssetToFileDownload = ({
  document,
  isMobile = false
}: {
  document: PseudoZipPIMDocument;
  isMobile?: boolean;
}): React.ReactElement => {
  const {
    config: { documentDownloadEndpoint }
  } = useConfig();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const downloadMultipleFiles = async () => {
    try {
      if (!documentDownloadEndpoint) {
        throw Error(
          "`GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT` missing in environment config"
        );
      }
      const [currentTime] = new Date()
        .toJSON()
        .replace(/[-:T]/g, "")
        .split(".");
      let zipFileName = `BMI_${document.assetType.pimCode + currentTime}.zip`;
      if (document.documentList.length > 0) {
        zipFileName = `${
          "productName" in document && `${document.productName} `
        }${document.assetType.name}.zip`;
      }

      const token = await executeRecaptcha();
      const assetFileCountMap: AssetUniqueFileCountMap =
        createAssetFileCountMap(document.documentList);
      const documents = document.documentList.map((asset, index) => ({
        href: asset.url,
        name:
          asset.realFileName && asset.realFileName !== ""
            ? generateFilenameByRealFileName(assetFileCountMap, asset, index)
            : generateFileNamebyTitle(
                assetFileCountMap,
                asset.title || asset.realFileName,
                asset.extension,
                index
              )
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

      await downloadAs(data.url, zipFileName);
    } catch (error) {
      logger.error({ message: error.message });
    }
  };
  if (isMobile) {
    return (
      <GTMButton
        gtm={{
          id: "download1",
          label: "Download",
          action: JSON.stringify(
            Object.values(document.documentList).map((asset) => asset.url)
          )
        }}
        variant="text"
        endIcon={<GetApp />}
        action={{
          model: "default",
          onClick: downloadMultipleFiles
        }}
      >
        {filesize(document.fileSize)}
      </GTMButton>
    );
  }

  return (
    <GTMButton
      gtm={{
        id: "download1",
        label: "Download",
        action: JSON.stringify(
          Object.values(document.documentList).map((asset) => asset.url)
        )
      }}
      action={{
        model: "default"
      }}
      onClick={downloadMultipleFiles}
      variant="text"
      accessibilityLabel="Download"
      startIcon={
        // eslint-disable-next-line security/detect-object-injection
        document.format && (
          <Icon
            // eslint-disable-next-line security/detect-object-injection
            source={fileIconsMap[document.format] || iconMap.FileUniversal}
            className={styles["download-icon"]}
          />
        )
      }
    >
      {filesize(document.fileSize)}
    </GTMButton>
  );
};

export type FileDownloadButtonProps = {
  url: string;
  format: string;
  size: number;
  assetTypeName: string;
  title: string;
  isLinkDocument: boolean;
};

const FileDownloadButton = ({ url, format, size }: FileDownloadButtonProps) =>
  format && url ? (
    <GTMButton
      gtm={{ id: "download1", label: "Download", action: url }}
      action={{
        model: "download",
        href: getDownloadLink(url)
      }}
      variant="text"
      startIcon={
        // eslint-disable-next-line security/detect-object-injection
        format && (
          <Icon
            // eslint-disable-next-line security/detect-object-injection
            source={fileIconsMap[format] || iconMap.FileUniversal}
            className={styles["download-icon"]}
          />
        )
      }
    >
      {filesize(size)}
    </GTMButton>
  ) : null;

const typenameToSizeMap: Record<
  (
    | ContentfulDocument
    | FsPimDocument
    | FsPimSystemDocument
    | EsContentfulDocument
    | EsPimDocument
    | EsPimSystemDocument
  )["__typename"],
  string | number
> = {
  ContentfulDocument: "asset.file.details.size",
  PIMDocument: "fileSize",
  PIMSystemDocument: "fileSize"
};

const DocumentSimpleTableResults = ({
  documents,
  headers = ["typeCode", "title", "download", "add"]
}: Props): React.ReactElement => {
  const { getMicroCopy } = useSiteContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { list } = useContext(DownloadListContext);

  if (isMobile) {
    return <DocumentSimpleTableResultsMobile documents={documents} />;
  }

  return (
    <div className={styles["DocumentSimpleTableResults"]}>
      <Table rowBgColorPattern="none">
        <Table.Head>
          <Table.Row>
            {headers.map((header) => (
              <Table.Cell
                key={`header-${header}`}
                className={classnames({
                  [styles["table-header"]]: ["download", "add"].includes(header)
                })}
              >
                {getMicroCopy(`documentLibrary.headers.${header}`)}
              </Table.Cell>
            ))}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {documents.map((document, index) => {
            if (!document) {
              return;
            }
            const { __typename } = document;

            return (
              <Table.Row
                key={`${__typename}-${index}`}
                className={classnames(styles["row"], {
                  // eslint-disable-next-line security/detect-object-injection
                  [styles["row--checked"]]: !!list[getUniqueId(document)]
                })}
                // eslint-disable-next-line security/detect-object-injection
                selected={!!list[getUniqueId(document)]}
              >
                {getDocument(document, headers)}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default DocumentSimpleTableResults;
