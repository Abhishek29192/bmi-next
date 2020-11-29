import React, { useContext, useState } from "react";
import filesize from "filesize";
import classnames from "classnames";
import Table from "@bmi/table";
import Button from "@bmi/button";
import Checkbox from "@bmi/checkbox";
import Icon, { iconMap } from "@bmi/icon";
import { Data as PIMDocumentData } from "./PIMDocument";
import { Data as DocumentData } from "./Document";
import { SiteContext } from "./Site";
import { getClickableActionFromUrl } from "./Link";
import styles from "./styles/DocumentSimpleTableResults.module.scss";

type Props = {
  documents: (DocumentData | PIMDocumentData)[];
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

const DocumentSimpleTableResults = ({ documents }: Props) => {
  const [checkedDocuments, setCheckedDocuments] = useState([]);
  const { getMicroCopy } = useContext(SiteContext);

  const handleChange = (document, checked) => {
    setCheckedDocuments((checkedDocuments) => [
      ...(checked
        ? [...checkedDocuments, document]
        : checkedDocuments.filter(
            (checkedDocument) => checkedDocument.rowIndex !== document.rowIndex
          ))
    ]);
  };

  return (
    <div className={styles["DocumentSimpleTableResults"]}>
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Cell>
              {getMicroCopy("documentLibrary.headers.title")}
            </Table.Cell>
            <Table.Cell>
              {getMicroCopy("documentLibrary.headers.download")}
            </Table.Cell>
            <Table.Cell>
              {getMicroCopy("documentLibrary.headers.add")}
            </Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {documents.map((document, index) => {
            const { id, title } = document;
            const assetData = mapAssetToFileDownload(document);

            return (
              <Table.Row
                key={`${title}-${index}`}
                className={classnames(styles["row"], {
                  [styles["row--checked"]]:
                    checkedDocuments.filter(
                      (checkedDocument) => checkedDocument.rowIndex === index
                    ).length > 0
                })}
              >
                <Table.Cell className={styles["table-cell"]}>
                  {title}
                </Table.Cell>
                <Table.Cell className={styles["table-cell"]} align="center">
                  <FileDownloadButton {...assetData} />
                </Table.Cell>
                <Table.Cell className={styles["table-cell"]} align="center">
                  <Checkbox
                    name={id}
                    inputProps={{
                      "aria-label": `${getMicroCopy(
                        "documentLibrary.download"
                      )} ${title}`
                    }}
                    onChange={(checked: boolean) =>
                      handleChange({ rowIndex: index, document }, checked)
                    }
                  />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default DocumentSimpleTableResults;
