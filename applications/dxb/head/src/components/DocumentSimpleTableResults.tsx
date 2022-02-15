import {
  Button,
  ButtonProps,
  ClickableAction,
  DownloadList,
  DownloadListContext,
  Icon,
  iconMap,
  Table
} from "@bmi-digital/components";
import classnames from "classnames";
import filesize from "filesize";
import React, { useContext } from "react";
import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import withGTM from "../utils/google-tag-manager";
import { DocumentData as SDPDocumentData } from "../templates/systemDetails/types";
import { getDownloadLink } from "../utils/client-download";
import { microCopy } from "../constants/microCopies";
import { Data as DocumentData } from "./Document";
import { useSiteContext } from "./Site";
import styles from "./styles/DocumentSimpleTableResults.module.scss";
import { Format } from "./types";
import { PIMDocumentData, PIMLinkDocumentData } from "./types/PIMDocumentBase";
import fileIconsMap from "./FileIconsMap";
import { DocumentSimpleTableResultsMobile } from "./DocumentSimpleTableResultsMobile";
import { FileContentTypeEnum, Mime } from "./types/pim";

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
};

const GTMButton =
  withGTM<
    ButtonProps & {
      action?: ClickableAction;
    }
  >(Button);

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

type FileDownloadButtonProps = {
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

export const getCount = (documents: Document[]) => {
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
  headers = ["typeCode", "title", "download", "add"]
}: Props) => {
  const { getMicroCopy } = useSiteContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { list } = useContext(DownloadListContext);
  const paginatedDocuments = documents.slice(
    (page - 1) * documentsPerPage,
    page * documentsPerPage
  );

  if (isMobile) {
    return <DocumentSimpleTableResultsMobile documents={paginatedDocuments} />;
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
          {paginatedDocuments.map((document, index) => {
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
                {headers.map((header) => {
                  const key = `${title}-body-${header}`;

                  if (header === "typeCode") {
                    return (
                      <Table.Cell className={styles["table-cell"]} key={key}>
                        <abbr title={document.assetType.name}>
                          {
                            (document.assetType as DocumentData["assetType"])
                              .code
                          }
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
                      <Table.Cell
                        className={styles["table-cell"]}
                        align="left"
                        key={key}
                      >
                        {document.__typename !== "PIMLinkDocument" ? (
                          <FileDownloadButton
                            {...mapAssetToFileDownload(document)}
                          />
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
                      <Table.Cell
                        className={styles["table-cell"]}
                        align="center"
                        key={key}
                      >
                        {document.__typename !== "PIMLinkDocument" ? (
                          <DownloadList.Checkbox
                            name={id}
                            maxLimitReachedLabel={getMicroCopy(
                              microCopy.DOCUMENTS_DOWNLOAD_MAX_REACHED
                            )}
                            ariaLabel={`${getMicroCopy(
                              microCopy.DOCUMENT_LIBRARY_DOWNLOAD
                            )} ${title}`}
                            value={document}
                            fileSize={
                              document[typenameToSizeMap[document.__typename]]
                            }
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
                })}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default DocumentSimpleTableResults;
