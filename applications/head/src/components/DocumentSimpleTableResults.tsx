import React, { useContext } from "react";
import filesize from "filesize";
import classnames from "classnames";
import { get } from "lodash";
import Table from "@bmi/table";
import Button from "@bmi/button";
import Icon, { iconMap } from "@bmi/icon";
import DownloadList, { DownloadListContext } from "@bmi/download-list";
import { Data as PIMDocumentData } from "./PIMDocument";
import { Data as PIMLinkDocumentData } from "./PIMLinkDocument";
import { Data as DocumentData } from "./Document";
import { SiteContext } from "./Site";
import styles from "./styles/DocumentSimpleTableResults.module.scss";

type AvailableHeader = "typeCode" | "type" | "title" | "download" | "add";

type Document = DocumentData | PIMDocumentData | PIMLinkDocumentData;

type Props = {
  documents: Document[];
  page: number;
  documentsPerPage: number;
  headers?: AvailableHeader[];
};

type Format = "application/pdf" | "image/jpg" | "image/jpeg" | "image/png";

const fileIconsMap: Record<Format, React.ComponentType> = {
  "application/pdf": iconMap.FilePDF,
  "image/jpg": iconMap.FileJPG,
  "image/jpeg": iconMap.FileJPEG,
  "image/png": iconMap.FilePNG
};

const mapAssetToFileDownload = (
  data: DocumentData | PIMDocumentData
): FileDownloadButtonProps => {
  if (data.__typename === "PIMDocument") {
    const { url, format, fileSize: size } = data;

    return {
      url,
      // @ts-ignore: Format to string
      format,
      size
    };
  }

  const {
    asset: { file }
  } = data;

  return {
    url: file.url,
    // @ts-ignore: Format to string
    format: file.contentType,
    size: file.details.size
  };
};

type FileDownloadButtonProps = {
  url: string;
  format: Format;
  size: number;
};

const FileDownloadButton = ({ url, format, size }: FileDownloadButtonProps) =>
  format && url ? (
    <Button
      action={{
        model: "download",
        href: `https:${url.replace("https:", "")}`
      }}
      variant="text"
      startIcon={
        fileIconsMap[format] && (
          <Icon
            source={fileIconsMap[format]}
            className={styles["download-icon"]}
          />
        )
      }
    >
      {filesize(size)}
    </Button>
  ) : null;

export const getCount = (documents: Document[]) => {
  return documents.length;
};

const typenameToSizeMap: Record<Document["__typename"], string | number> = {
  ContentfulDocument: "asset.file.details.size",
  PIMDocument: "fileSize",
  PIMLinkDocument: 0
};

const DocumentSimpleTableResults = ({
  documents,
  page,
  documentsPerPage,
  headers = ["typeCode", "title", "download", "add"]
}: Props) => {
  const { getMicroCopy } = useContext(SiteContext);
  const { list } = useContext(DownloadListContext);
  const paginatedDocuments = documents.slice(
    (page - 1) * documentsPerPage,
    page * documentsPerPage
  );

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
                  [styles["row--checked"]]: !!list[id]
                })}
              >
                {headers.map((header) => {
                  const key = `${title}-body-${header}`;

                  if (header === "typeCode") {
                    return (
                      <Table.Cell className={styles["table-cell"]} key={key}>
                        <abbr title={document.assetType.name}>
                          {document.assetType.code}
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
                              "documents.download.maxReached"
                            )}
                            ariaLabel={`${getMicroCopy(
                              "documentLibrary.download"
                            )} ${title}`}
                            value={document}
                            fileSize={get(
                              document,
                              typenameToSizeMap[document.__typename]
                            )}
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
