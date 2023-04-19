import {
  DownloadList,
  DownloadListContext,
  Table
} from "@bmi-digital/components";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import classnames from "classnames";
import filesize from "filesize";
import React, { useContext } from "react";
import { microCopy } from "../constants/microCopies";
import {
  getFileSizeByDocumentType,
  getFileUrlByDocumentType,
  getProductStatus,
  getValidityDate
} from "../utils/documentUtils";
import { Document, DocumentTableHeader } from "../types/Document";
import { DocumentSimpleTableResultsMobile } from "./DocumentSimpleTableResultsMobile";
import { useSiteContext } from "./Site";
import {
  ActionsContainer,
  classes,
  DocumentRow,
  DocumentStatus,
  StyledSimpleTableResults,
  StyledTableCell,
  StyledTitleTableCell
} from "./styles/DocumentSimpleTableResultsStyles";
import {
  CopyToClipboard,
  DownloadDocumentButton,
  DocumentTitle
} from "./DocumentSimpleTableResultCommon";

export type Props = {
  documents: readonly Document[];
  headers?: DocumentTableHeader[];
};

export const getIsLinkDocument = (document: Document): boolean =>
  "isLinkDocument" in document && document.isLinkDocument;

const PIM_TYPES = ["PIMDocument", "PIMSystemDocument"];

export const isPIMDocument = (document: Document): boolean =>
  PIM_TYPES.includes(document.__typename);

export const getUniqueId = (document: Document): string =>
  `${document.id}-${document.title}`.replace(/ /g, "_");

const DocumentCells = ({
  document,
  headers
}: {
  document: Document;
  headers: DocumentTableHeader[];
}) => {
  const { getMicroCopy } = useSiteContext();
  const isLinkDocument = getIsLinkDocument(document);
  const fileSize = getFileSizeByDocumentType(document);
  const { __typename } = document;

  return (
    <>
      {headers.map((header) => {
        const key = `${__typename}-body-${header}`;

        switch (header) {
          case "typeCode":
            return (
              <StyledTableCell
                key={key}
                data-testid={`document-table-title-${document.id}`}
              >
                <abbr title={document.assetType.name}>
                  {document.assetType.code}
                </abbr>
              </StyledTableCell>
            );
          case "type":
            return (
              <StyledTableCell
                key={key}
                data-testid={`document-table-type-${document.id}`}
              >
                {document.assetType.name}
              </StyledTableCell>
            );
          case "productStatus":
            return (
              <StyledTableCell
                key={key}
                data-testid={`document-table-productStatus-${document.id}`}
              >
                {"approvalStatus" in document ? (
                  <DocumentStatus status={document.approvalStatus}>
                    {getProductStatus(document, getMicroCopy)}
                  </DocumentStatus>
                ) : (
                  "-"
                )}
              </StyledTableCell>
            );
          case "validityDate":
            return (
              <StyledTableCell
                key={key}
                data-testid={`document-table-validityDate-${document.id}`}
              >
                {getValidityDate(document)}
              </StyledTableCell>
            );
          case "title":
            return (
              <StyledTitleTableCell
                key={key}
                data-testid={`document-table-title-${document.id}`}
              >
                <DocumentTitle document={document} />
              </StyledTitleTableCell>
            );
          case "actions":
            return (
              <StyledTableCell
                key={key}
                data-testid={`document-table-actions-${document.id}`}
              >
                <ActionsContainer>
                  {!isLinkDocument && (
                    <DownloadDocumentButton document={document} />
                  )}
                  {document.__typename !== "PIMDocumentWithPseudoZip" && (
                    <CopyToClipboard
                      id={document.id}
                      url={getFileUrlByDocumentType(document)}
                      title={document.title}
                    />
                  )}
                </ActionsContainer>
              </StyledTableCell>
            );
          case "size":
            return (
              <StyledTableCell
                key={key}
                data-testid={`document-table-size-${document.id}`}
              >
                {isLinkDocument ? "-" : filesize(fileSize)}
              </StyledTableCell>
            );
          case "add":
            return !(document.__typename === "PIMDocumentWithPseudoZip") ? (
              <StyledTableCell
                align="center"
                key={key}
                data-testid={`document-table-add-${document.id}`}
              >
                <DownloadList.Checkbox
                  name={getUniqueId(document)}
                  maxLimitReachedLabel={getMicroCopy(
                    microCopy.DOCUMENTS_DOWNLOAD_MAX_REACHED
                  )}
                  ariaLabel={`${getMicroCopy(
                    microCopy.DOCUMENT_LIBRARY_DOWNLOAD
                  )} ${document.title}`}
                  value={document}
                  fileSize={fileSize || 0}
                  disabled={isLinkDocument}
                />
              </StyledTableCell>
            ) : (
              <StyledTableCell
                align="center"
                key={key}
                data-testid={`document-table-add-${document.id}`}
              >
                <DownloadList.Checkbox
                  name={getUniqueId(document)}
                  maxLimitReachedLabel={getMicroCopy(
                    microCopy.DOCUMENTS_DOWNLOAD_MAX_REACHED
                  )}
                  ariaLabel={`${getMicroCopy(
                    microCopy.DOCUMENT_LIBRARY_DOWNLOAD
                  )} ${document.assetType.name}`}
                  value={document.documentList}
                  fileSize={fileSize}
                  disabled={isLinkDocument}
                />
              </StyledTableCell>
            );
        }

        if (header === "name" && isPIMDocument(document)) {
          return (
            <StyledTableCell
              key={key}
              data-testid={`document-table-name-${document.id}`}
            >
              {document.title}
            </StyledTableCell>
          );
        }

        return (
          <StyledTableCell
            key={key}
            data-testid={`document-table-unknown-${document.id}`}
          >
            n/d
          </StyledTableCell>
        );
      })}
    </>
  );
};

const DocumentSimpleTableResults = ({
  documents,
  headers = ["add", "typeCode", "title", "size", "actions"]
}: Props): React.ReactElement => {
  const { getMicroCopy } = useSiteContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const { list } = useContext(DownloadListContext);

  if (isMobile) {
    return (
      <DocumentSimpleTableResultsMobile
        documents={documents}
        headers={headers}
      />
    );
  }

  return (
    <StyledSimpleTableResults
      className={classnames("DocumentSimpleTableResults")}
      data-testid="document-simple-table-results"
    >
      <Table rowBgColorPattern="none">
        <Table.Head>
          <Table.Row>
            {headers.map((header) => (
              <Table.Cell
                key={`header-${header}`}
                className={classnames(
                  ["actions", "add"].includes(header) && classes.tableHeader
                )}
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
              <DocumentRow
                key={`${__typename}-${index}`}
                className={classnames(
                  "row",
                  // eslint-disable-next-line security/detect-object-injection
                  !!list[getUniqueId(document)] && classes.checked
                )}
                // eslint-disable-next-line security/detect-object-injection
                selected={!!list[getUniqueId(document)]}
                data-testid={`document-table-row-${document.id}`}
              >
                <DocumentCells document={document} headers={headers} />
              </DocumentRow>
            );
          })}
        </Table.Body>
      </Table>
    </StyledSimpleTableResults>
  );
};

export default DocumentSimpleTableResults;
