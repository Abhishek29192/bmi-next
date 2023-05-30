import {
  DownloadList,
  DownloadListContext,
  Table,
  Checkbox
} from "@bmi-digital/components";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import classnames from "classnames";
import { filesize } from "filesize";
import React, { useContext, useState, useEffect } from "react";
import { microCopy } from "../constants/microCopies";
import { Document, DocumentTableHeader, TitleField } from "../types/Document";
import {
  getFileSizeByDocumentType,
  getFileUrlByDocumentType,
  getIsLinkDocument,
  getProductStatus,
  getUniqueId,
  getValidityDate
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
  headers?: DocumentTableHeader[];
};

const PIM_TYPES = ["PIMDocument", "PIMSystemDocument"];

export const isPIMDocument = (document: Document): boolean =>
  PIM_TYPES.includes(document.__typename);

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
  const isZipDocument = __typename === "PIMDocumentWithPseudoZip";
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
                  maxLimitReachedLabel={getMicroCopy(
                    microCopy.DOCUMENTS_DOWNLOAD_MAX_REACHED
                  )}
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
  headers = ["add", "typeCode", "title", "size", "actions"]
}: Props): React.ReactElement => {
  const { getMicroCopy } = useSiteContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const { list, updateList, count } = useContext(DownloadListContext);
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(0);
  const titleField =
    headers.includes("type") && !headers.includes("title") ? "type" : "title";
  const filteredDocs = documents.filter((d) => !getIsLinkDocument(d));
  const howManyIsAlreadySelected = (doc: Document[]): number => {
    let counts = 0;
    doc.forEach((d) => {
      if (list[getUniqueId(d)]) {
        counts = counts + 1;
      }
    });
    setSelectedDoc(counts);
    return counts;
  };
  const handleSelectAll = (selectedAll: boolean): void => {
    if (selectedAll) {
      if (selectedDoc === filteredDocs.length) {
        return;
      }
      filteredDocs.forEach((d) => updateList(getUniqueId(d), d));
    } else {
      if (count === 0 || selectedDoc !== filteredDocs.length) {
        return;
      }
      documents.forEach((d) => updateList(getUniqueId(d), false));
    }
  };
  useEffect(() => {
    handleSelectAll(selectedAll);
  }, [selectedAll]);

  useEffect(() => {
    const alreadySelected = howManyIsAlreadySelected(filteredDocs);
    if (alreadySelected === filteredDocs.length) {
      setSelectedAll(true);
    } else {
      setSelectedAll(false);
    }
  }, [list, documents]);

  const setSelectAll = () => {
    setSelectedAll(!selectedAll);
  };

  if (isMobile) {
    return (
      <DocumentSimpleTableResultsMobile
        documents={documents}
        headers={headers}
        selectedDocuments={list}
        titleField={titleField}
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
                  ["actions", "add"].includes(header) && classes.tableHeader,
                  ["add"].includes(header) && classes.tableHeaderCentered
                )}
              >
                {header === "add" ? (
                  <Checkbox
                    data-testid={`document-table-select-all`}
                    name="add"
                    aria-label={`${getMicroCopy(
                      `documentLibrary.headers.add`
                    )}`}
                    value={selectedAll}
                    checked={selectedAll}
                    onChange={setSelectAll}
                    disabled={!filteredDocs.length}
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
