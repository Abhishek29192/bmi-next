import DownloadList, {
  DownloadListContext
} from "@bmi-digital/components/download-list";
import Table from "@bmi-digital/components/table";
import { microCopy } from "@bmi/microcopies";
import classnames from "classnames";
import { filesize } from "filesize";
import React, { useContext, useEffect } from "react";
import { Document, DocumentTableHeader, TitleField } from "../types/Document";
import { PseudoZipPIMDocument } from "../types/pim";
import {
  getFileSizeByDocumentType,
  getFileUrlByDocumentType,
  getIsLinkDocument,
  getProductStatus,
  getUniqueId,
  getValidityDate,
  useShowMobileTable
} from "../utils/documentUtils";
import {
  CopyToClipboard,
  DocumentTitle,
  DownloadDocumentButton
} from "./DocumentSimpleTableResultCommon";
import { DocumentSimpleTableResultsMobile } from "./DocumentSimpleTableResultsMobile";
import { useSiteContext } from "./Site";
import { DocumentStatus } from "./styles/DocumentSimpleTableResultsCommonStyles";
import {
  ActionsContainer,
  DocumentRow,
  StyledSimpleTableResults,
  StyledTableCell,
  StyledTitleTableCell,
  classes
} from "./styles/DocumentSimpleTableResultsStyles";

export type Props = {
  documents: readonly Document[];
  pageNumber?: number;
  headers?: DocumentTableHeader[];
};

export type Mutable<Type> = {
  -readonly [Key in keyof Type]: Type[Key];
};

const PIM_TYPES = ["PIMDocument", "PIMSystemDocument"];

export const isPIMDocument = (document: Document): boolean =>
  PIM_TYPES.includes(document.__typename);

export const ifZipDocument = (
  document: Document
): document is PseudoZipPIMDocument =>
  document.__typename === "PIMDocumentWithPseudoZip";

const DocumentCells = ({
  document,
  headers,
  titleField
}: {
  document: Document;
  headers: DocumentTableHeader[];
  titleField: TitleField;
}) => {
  const { getMicroCopy } = useSiteContext();
  const { __typename } = document;
  const isLinkDocument = getIsLinkDocument(document);
  const isZipDocument = ifZipDocument(document);
  const fileSize = getFileSizeByDocumentType(document);

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
                {titleField === "title" ? (
                  document.assetType.name
                ) : (
                  <DocumentTitle document={document} titleField="type" />
                )}
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
                      href={getFileUrlByDocumentType(document) || ""}
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
                {isLinkDocument
                  ? "-"
                  : (filesize(fileSize, { output: "string" }) as string)}
              </StyledTableCell>
            );
          case "add":
            return (
              <StyledTableCell
                align="center"
                key={key}
                data-testid={`document-table-add-${document.id}`}
              >
                <DownloadList.Checkbox
                  name={getUniqueId(document)}
                  ariaLabel={`${getMicroCopy(
                    microCopy.DOCUMENT_LIBRARY_DOWNLOAD
                  )} ${
                    isZipDocument ? document.assetType.name : document.title
                  }`}
                  value={isZipDocument ? document.documentList : document}
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
  pageNumber,
  headers = ["add", "typeCode", "title", "size", "actions"]
}: Props): React.ReactElement => {
  const { getMicroCopy } = useSiteContext();

  const {
    list,
    updateAllListItems,
    setSelectAllCheckboxDisabledByPage,
    setCurrentPage,
    resetAllListItems
  } = useContext(DownloadListContext);

  const nonLinkedDocuments = documents.filter(
    (document) => !getIsLinkDocument(document)
  );

  const { showMobileTable, handleTableSizeChange, ref } = useShowMobileTable();
  const titleField =
    headers.includes("type") && !headers.includes("title") ? "type" : "title";

  useEffect(() => {
    resetAllListItems();
    nonLinkedDocuments.forEach((document) =>
      updateAllListItems(
        pageNumber,
        getUniqueId(document),
        ifZipDocument(document) ? document.documentList : document,
        getFileSizeByDocumentType(document)
      )
    );

    setCurrentPage(pageNumber);
    setSelectAllCheckboxDisabledByPage(pageNumber)(
      documents.length !== 0 && nonLinkedDocuments.length === 0
    );
  }, [pageNumber, documents]);

  if (showMobileTable) {
    return (
      <DocumentSimpleTableResultsMobile
        documents={documents}
        headers={headers}
        selectedDocuments={list}
        titleField={titleField}
        ref={ref}
      />
    );
  }

  return (
    <StyledSimpleTableResults
      className={classnames("DocumentSimpleTableResults")}
      data-testid="document-simple-table-results"
      ref={ref}
    >
      <Table rowBgColorPattern="none" onTableSizeChange={handleTableSizeChange}>
        <Table.Head>
          <Table.Row>
            {headers.map((header) => (
              <Table.Cell
                key={`header-${header}`}
                className={classnames(
                  ["actions", "add"].includes(header) && classes.tableHeader,
                  ["add"].includes(header) && classes.tableHeaderCentered
                )}
              >
                {header === "add" ? (
                  <DownloadList.SelectAllCheckBox
                    name="add"
                    ariaLabel={`${getMicroCopy(
                      microCopy.DOCUMENT_LIBRARY_HEADERS_ADD
                    )}`}
                    disabled={!nonLinkedDocuments.length}
                    dataTestid={`document-table-select-all`}
                  />
                ) : (
                  getMicroCopy(`documentLibrary.headers.${header}`)
                )}
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
                <DocumentCells
                  document={document}
                  headers={headers}
                  titleField={titleField}
                />
              </DocumentRow>
            );
          })}
        </Table.Body>
      </Table>
    </StyledSimpleTableResults>
  );
};

export default DocumentSimpleTableResults;
