import React, { useContext } from "react";
import Table from "@bmi/table";
import Button from "@bmi/button";
import Checkbox from "@bmi/checkbox";
import Icon, { iconMap } from "@bmi/icon";
import { Data as DocumentData } from "./Document";
import { SiteContext } from "./Site";
import { getClickableActionFromUrl } from "./Link";
import filesize from "filesize";
import styles from "./styles/DocumentSimpleTableResults.module.scss";

type Props = {
  documents: DocumentData[];
};

const fileIconsMap = {
  "application/pdf": iconMap.FilePDF,
  "image/jpeg": iconMap.FileJPEG,
  "image/png": iconMap.FilePNG
};

// TODO: consider global approach to BMI icons
const iconStyle = {
  width: "1em",
  height: "1em"
};

const FileDownloadButton = ({
  url,
  contentType,
  details
}: DocumentData["asset"]["file"]) => (
  <Button
    action={getClickableActionFromUrl(null, null, null, `https:${url}`)}
    variant="text"
    startIcon={
      <Icon
        source={fileIconsMap[contentType]}
        // TODO: consider responsibility of icon styles
        style={iconStyle}
      />
    }
  >
    {filesize(details.size)}
  </Button>
);

const DocumentSimpleTableResults = ({ documents }: Props) => {
  const { getMicroCopy } = useContext(SiteContext);

  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Cell>
            {getMicroCopy("documentDownloadLibrary.product")}
          </Table.Cell>
          <Table.Cell>
            {getMicroCopy("documentDownloadLibrary.download")}
          </Table.Cell>
          <Table.Cell>{getMicroCopy("documentDownloadLibrary.add")}</Table.Cell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {documents.map(({ title, asset }, index) => {
          return (
            <Table.Row key={`${title}-${index}`}>
              <Table.Cell className={styles["table-cell"]}>{title}</Table.Cell>
              <Table.Cell className={styles["table-cell"]} align="center">
                <FileDownloadButton {...asset.file} />
              </Table.Cell>
              <Table.Cell className={styles["table-cell"]} align="center">
                <Checkbox
                  name={asset.file.fileName}
                  inputProps={{
                    "aria-label": `${getMicroCopy(
                      "documentDownloadLibrary.download"
                    )} ${title}`
                  }}
                />
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default DocumentSimpleTableResults;
