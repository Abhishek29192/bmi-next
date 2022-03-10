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
import classnames from "classnames";
import filesize from "filesize";
import React, { useContext } from "react";
import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import axios from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { GetApp } from "@material-ui/icons";
import withGTM from "../utils/google-tag-manager";
import { DocumentData as SDPDocumentData } from "../templates/systemDetails/types";
import { downloadAs, getDownloadLink } from "../utils/client-download";
import { microCopy } from "../constants/microCopies";
import { Data as DocumentData } from "./Document";
import { useSiteContext } from "./Site";
import styles from "./styles/DocumentSimpleTableResults.module.scss";
import { Format } from "./types";
import { PIMDocumentData, PIMLinkDocumentData } from "./types/PIMDocumentBase";
import fileIconsMap from "./FileIconsMap";
import { DocumentSimpleTableResultsMobile } from "./DocumentSimpleTableResultsMobile";
import { FileContentTypeEnum, Mime } from "./types/pim";
import createAssetFileCountMap, {
  AssetUniqueFileCountMap,
  generateFilenameByRealFileName,
  generateFileNamebyTitle
} from "./DocumentFileUtils";

type AvailableHeader = "typeCode" | "type" | "title" | "download" | "add";

export type Document =
  | DocumentData
  | PIMDocumentData
  | PIMLinkDocumentData
  | SDPDocumentData;

type Props = {
  documents: Document[];
  page: number;
  documentsPerPage: number;
  headers?: AvailableHeader[];
  documentsByAssetType?: [string, (PIMDocumentData | PIMLinkDocumentData)[]][];
};

const GTMButton = withGTM<
  ButtonProps & {
    action?: ClickableAction;
  }
>(Button);

const getDocument = (
  documents: Document[],
  headers: AvailableHeader[],
  multipleDocuments = false
) => {
  const { getMicroCopy } = useSiteContext();
  const document = documents[0];

  const { title, id } = document;
  return headers.map((header) => {
    const key = `${title}-body-${header}`;

    if (header === "typeCode") {
      return (
        <Table.Cell className={styles["table-cell"]} key={key}>
          <abbr title={document.assetType.name}>
            {(document.assetType as DocumentData["assetType"]).code}
          </abbr>
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

    if (header === "title") {
      return (
        <Table.Cell className={styles["table-cell"]} key={key}>
          {title}
        </Table.Cell>
      );
    }

    if (header === "download") {
      return (
        <Table.Cell className={styles["table-cell"]} align="left" key={key}>
          {document.__typename !== "PIMLinkDocument" ? (
            multipleDocuments ? (
              <MultipleAssetToFileDownload
                assets={
                  documents.filter(
                    (asset) => asset.__typename === "PIMDocument"
                  ) as PIMDocumentData[]
                }
              />
            ) : (
              <FileDownloadButton {...mapAssetToFileDownload(document)} />
            )
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
        </Table.Cell>
      );
    }
    if (header === "add") {
      return (
        <Table.Cell className={styles["table-cell"]} align="center" key={key}>
          {document.__typename !== "PIMLinkDocument" &&
          mapAssetToFileDownload(document).size ? (
            <DownloadList.Checkbox
              name={id}
              maxLimitReachedLabel={getMicroCopy(
                microCopy.DOCUMENTS_DOWNLOAD_MAX_REACHED
              )}
              ariaLabel={`${getMicroCopy(
                microCopy.DOCUMENT_LIBRARY_DOWNLOAD
              )} ${title}`}
              value={document}
              fileSize={document[typenameToSizeMap[document.__typename]]}
            />
          ) : (
            <span className={styles["no-document-icon"]}>-</span>
          )}
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

const DocumentsByAssetType = ({ documentsByAssetType, list, headers }) => {
  return documentsByAssetType.map(([assetCode, assets], index) => {
    const key = `${
      assets.find(({ assetType }) => assetType.code)?.assetType.code
    }-${index}`;

    const pimLinkDocuments = assets.filter(
      (asset) => asset.__typename == "PIMLinkDocument" || !asset.fileSize
    );

    const zipDocuments = assets.filter(
      (asset) => asset.__typename === "PIMDocument" && asset.extension === "zip"
    );

    const filteredDocuments = assets.filter(
      (asset) =>
        (asset.__typename = "PIMDocument") &&
        asset.fileSize &&
        asset.extension !== "zip"
    );

    return (
      <>
        {pimLinkDocuments.length > 0 &&
          pimLinkDocuments.map((asset, index) => {
            const newKey = key + index;
            return (
              <Table.Row
                key={newKey}
                className={classnames(styles["row"], {
                  // eslint-disable-next-line security/detect-object-injection
                  [styles["row--checked"]]: !!list[newKey]
                })}
                // eslint-disable-next-line security/detect-object-injection
                selected={!!list[newKey]}
              >
                {getDocument(
                  [{ ...asset, __typename: "PIMLinkDocument" }],
                  headers
                )}
              </Table.Row>
            );
          })}
        {zipDocuments.length > 0 &&
          zipDocuments.map((asset, index) => {
            const newKey = key + index;
            return (
              <Table.Row
                key={newKey}
                className={classnames(styles["row"], {
                  // eslint-disable-next-line security/detect-object-injection
                  [styles["row--checked"]]: !!list[newKey]
                })}
                // eslint-disable-next-line security/detect-object-injection
                selected={!!list[newKey]}
              >
                {getDocument([asset], headers)}
              </Table.Row>
            );
          })}

        {filteredDocuments.length > 0 && (
          <Table.Row
            key={key}
            className={classnames(styles["row"], {
              // eslint-disable-next-line security/detect-object-injection
              [styles["row--checked"]]: !!list[key]
            })}
            // eslint-disable-next-line security/detect-object-injection
            selected={!!list[key]}
          >
            {filteredDocuments.length === 1
              ? getDocument(filteredDocuments, headers)
              : getDocument(filteredDocuments, headers, true)}
          </Table.Row>
        )}
      </>
    );
  });
};
export const mapAssetToFileDownload = (
  data: DocumentData | PIMDocumentData | SDPDocumentData
): FileDownloadButtonProps => {
  if (data.__typename === "PIMDocument") {
    const { url, format, fileSize: size } = data;

    return {
      url,
      format,
      size
    };
  }

  const {
    asset: { file }
  } = data;

  return {
    url: file.url,
    format: file.contentType,
    size: file.details.size
  };
};

export const MultipleAssetToFileDownload = ({
  assets,
  isMobile = false
}: {
  assets: PIMDocumentData[];
  isMobile?: boolean;
}): React.ReactElement => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const format = "application/zip";
  const size = assets.reduce((a, c) => a + c.fileSize, 0);
  const downloadMultipleFiles = async () => {
    try {
      if (!process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT) {
        throw Error(
          "`GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT` missing in environment config"
        );
      }
      const [currentTime] = new Date()
        .toJSON()
        .replace(/-|:|T/g, "")
        .split(".");
      let zipFileName = `BMI_${currentTime}.zip`;
      if (assets.length > 0 && assets[0].product && assets[0].assetType) {
        zipFileName = `${assets[0].product?.name} ${assets[0].assetType.name}.zip`;
      }

      const token = await executeRecaptcha();
      const pimDocumentAssets: PIMDocumentData[] = assets.filter(
        (asset): asset is PIMDocumentData => asset.__typename === "PIMDocument"
      );
      const assetFileCountMap: AssetUniqueFileCountMap =
        createAssetFileCountMap(pimDocumentAssets);
      const documents = pimDocumentAssets.map((asset, index) => ({
        href: asset.url,
        name:
          asset.realFileName && asset.realFileName !== ""
            ? generateFilenameByRealFileName(assetFileCountMap, asset, index)
            : generateFileNamebyTitle(
                assetFileCountMap,
                asset.title,
                asset.extension,
                index
              )
      }));
      const response = await axios.post(
        process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT,
        { documents: documents },
        { responseType: "text", headers: { "X-Recaptcha-Token": token } }
      );
      await downloadAs(response.data.url, zipFileName);
    } catch (error) {
      console.error("Download multipleDocuments documents", error); // eslint-disable-line
    }
  };
  if (isMobile) {
    return (
      <GTMButton
        gtm={{
          id: "download1",
          label: "Download",
          action: JSON.stringify(
            Object.values(assets).map((asset) => asset.url)
          )
        }}
        variant="text"
        endIcon={<GetApp />}
        action={{
          model: "default",
          onClick: downloadMultipleFiles
        }}
      >
        {filesize(size)}
      </GTMButton>
    );
  }

  return (
    <GTMButton
      gtm={{
        id: "download1",
        label: "Download",
        action: JSON.stringify(Object.values(assets).map((asset) => asset.url))
      }}
      action={{
        model: "default",
        onClick: downloadMultipleFiles
      }}
      variant="text"
      accessibilityLabel="Download"
      startIcon={
        // eslint-disable-next-line security/detect-object-injection
        fileIconsMap[format] && (
          <Icon
            // eslint-disable-next-line security/detect-object-injection
            source={fileIconsMap[format]}
            className={styles["download-icon"]}
          />
        )
      }
    >
      {filesize(size)}
    </GTMButton>
  );
};

export type FileDownloadButtonProps = {
  url: string;
  format: Format | Mime | FileContentTypeEnum;
  size: number;
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
        fileIconsMap[format] && (
          <Icon
            // eslint-disable-next-line security/detect-object-injection
            source={fileIconsMap[format]}
            className={styles["download-icon"]}
          />
        )
      }
    >
      {filesize(size)}
    </GTMButton>
  ) : null;

export const getCount = (documents: Document[]): number => {
  return documents.length;
};

const typenameToSizeMap: Record<Document["__typename"], string | number> = {
  ContentfulDocument: "asset.file.details.size",
  PIMDocument: "fileSize",
  PIMLinkDocument: 0,
  SDPDocument: "fileSize"
};

const DocumentSimpleTableResults = ({
  documents,
  page,
  documentsPerPage,
  headers = ["typeCode", "title", "download", "add"],
  documentsByAssetType
}: Props): React.ReactElement => {
  const { getMicroCopy } = useSiteContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { list } = useContext(DownloadListContext);
  const paginatedDocuments = documents.slice(
    (page - 1) * documentsPerPage,
    page * documentsPerPage
  );

  if (isMobile) {
    return (
      <DocumentSimpleTableResultsMobile
        documents={paginatedDocuments}
        documentsByAssetType={documentsByAssetType}
      />
    );
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
          {documentsByAssetType ? (
            <DocumentsByAssetType
              documentsByAssetType={documentsByAssetType}
              headers={headers}
              list={list}
            />
          ) : (
            paginatedDocuments.map((document, index) => {
              const { id, title } = document;

              return (
                <Table.Row
                  key={`${title}-${index}`}
                  className={classnames(styles["row"], {
                    // eslint-disable-next-line security/detect-object-injection
                    [styles["row--checked"]]: !!list[id]
                  })}
                  // eslint-disable-next-line security/detect-object-injection
                  selected={!!list[id]}
                >
                  {getDocument([document], headers)}
                </Table.Row>
              );
            })
          )}
        </Table.Body>
      </Table>
    </div>
  );
};

export default DocumentSimpleTableResults;
