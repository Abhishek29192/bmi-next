import React, { useContext } from "react";
import filesize from "filesize";
import classnames from "classnames";
import Table from "@bmi/table";
import Button from "@bmi/button";
import Icon, { iconMap } from "@bmi/icon";
import { Data as PIMDocumentData } from "./PIMDocument";
import { Data as DocumentData } from "./Document";
import { SiteContext } from "./Site";
import { getClickableActionFromUrl } from "./Link";
import DownloadList, { DownloadListContext } from "@bmi/download-list";
import styles from "./styles/DocumentSimpleTableResults.module.scss";

type AvailableHeader = "type" | "title" | "download" | "add";

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
    action={getClickableActionFromUrl(null, null, null, `https:${url}`)}
    variant="text"
    startIcon={
      <Icon source={fileIconsMap[format]} className={styles["download-icon"]} />
    }
  >
    {filesize(size)}
  </Button>
);

const DocumentSimpleTableResults = ({
  documents,
  page,
  documentsPerPage,
  headers = ["type", "title", "download", "add"]
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
            const assetData = mapAssetToFileDownload(document);

            return (
              <Table.Row
                key={`${title}-${index}`}
                className={classnames(styles["row"], {
                  [styles["row--checked"]]: !!list[id]
                })}
              >
                {headers.map((header) => {
                  const key = `${title}-body-${header}`;

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
