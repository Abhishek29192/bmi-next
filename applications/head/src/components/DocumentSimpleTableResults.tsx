import React, { useContext, useMemo } from "react";
import filesize from "filesize";
import classnames from "classnames";
import Table from "@bmi/table";
import Button from "@bmi/button";
import { groupBy } from "lodash";
import Icon, { iconMap } from "@bmi/icon";
import { Data as PIMDocumentData } from "./PIMDocument";
import { Data as DocumentData } from "./Document";
import { SiteContext } from "./Site";
import DownloadList, { DownloadListContext } from "@bmi/download-list";
import styles from "./styles/DocumentSimpleTableResults.module.scss";

type AvailableHeader = "typeCode" | "type" | "title" | "download" | "add";

type Props = {
  documents: (DocumentData | PIMDocumentData)[];
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

const FileDownloadButton = ({ url, format, size }: FileDownloadButtonProps) => (
  <Button
    action={{
      model: "download",
      href: `https:${url.replace("https:", "")}`
    }}
    variant="text"
    startIcon={
      <Icon source={fileIconsMap[format]} className={styles["download-icon"]} />
    }
  >
    {filesize(size)}
  </Button>
);

export const getCount = (documents: Props["documents"]) => {
  return documents.length;
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
  const assetTypesCount = useMemo(
    () => Object.keys(groupBy(documents, "assetType.code")).length,
    [documents]
  );
  const tableHeaders = headers.filter((header) => {
    if (assetTypesCount < 2 && header.includes("type")) {
      return false;
    }

    return true;
  });

  return (
    <div className={styles["DocumentSimpleTableResults"]}>
      <Table rowBgColorPattern="none">
        <Table.Head>
          <Table.Row>
            {tableHeaders.map((header) => (
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
            const assetData = mapAssetToFileDownload(document);

            return (
              <Table.Row
                key={`${title}-${index}`}
                className={classnames(styles["row"], {
                  [styles["row--checked"]]: !!list[id]
                })}
              >
                {tableHeaders.map((header) => {
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
                        <FileDownloadButton {...assetData} />
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
                        <DownloadList.Checkbox
                          name={id}
                          ariaLabel={`${getMicroCopy(
                            "documentLibrary.download"
                          )} ${title}`}
                          value={document}
                        />
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
