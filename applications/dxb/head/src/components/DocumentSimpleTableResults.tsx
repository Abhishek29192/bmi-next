import Button, { ButtonProps } from "@bmi/button";
import DownloadList, { DownloadListContext } from "@bmi/download-list";
import { ClickableAction } from "@bmi/clickable";
import Icon, { iconMap } from "@bmi/icon";
import Table from "@bmi/table";
import classnames from "classnames";
import filesize from "filesize";
import { get } from "lodash";
import React, { useContext } from "react";
import Typography from "@bmi/typography";
import { GetApp } from "@material-ui/icons";
import { useMediaQuery } from "@material-ui/core";
import withGTM from "../utils/google-tag-manager";

import {
  PIMDocumentData,
  PIMLinkDocumentData
} from "../components/types/PIMDocumentBase";
import { DocumentData as SDPDocumentData } from "../templates/systemDetails/types";
import { Data as DocumentData } from "./Document";
import { useSiteContext } from "./Site";
import styles from "./styles/DocumentSimpleTableResults.module.scss";
import { Format } from "./types";
import fileIconsMap from "./FileIconsMap";

type AvailableHeader = "typeCode" | "type" | "title" | "download" | "add";

type Document =
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

type ListProps = {
  documents: Document[];
};

const GTMButton =
  withGTM<
    ButtonProps & {
      action?: ClickableAction;
    }
  >(Button);

const mapAssetToFileDownload = (
  data: DocumentData | PIMDocumentData | SDPDocumentData
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
    <GTMButton
      gtm={{ id: "download1", label: "Download", action: url }}
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

const DocumentSimpleTableResultsMobile = ({ documents }: ListProps) => {
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
                href: `https:${asset.url.replace("https:", "")}`
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

const DocumentSimpleTableResults = ({
  documents,
  page,
  documentsPerPage,
  headers = ["typeCode", "title", "download", "add"]
}: Props) => {
  const { getMicroCopy } = useSiteContext();
  const isMobile = useMediaQuery("(max-width:840px)");
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
                  [styles["row--checked"]]: !!list[id]
                })}
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
