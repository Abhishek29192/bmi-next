import filesize from "filesize";
import React from "react";
import { microCopy } from "../constants/microCopies";
import { Document, DocumentTableHeader } from "../types/Document";
import {
  getFileSizeByDocumentType,
  getFileUrlByDocumentType,
  getIsLinkDocument,
  getProductStatus,
  getValidityDate
} from "../utils/documentUtils";
import {
  CopyToClipboard,
  DocumentTitle,
  DownloadDocumentButton
} from "./DocumentSimpleTableResultCommon";
import { useSiteContext } from "./Site";
import { DocumentStatus } from "./styles/DocumentSimpleTableResultsCommonStyles";
import {
  Actions,
  FieldTitle,
  FieldValue,
  StyledListItem,
  StyledListRow,
  StyledListRowItem,
  StyledListTitleRow
} from "./styles/DocumentSimpleTableResultsMobileStyles";

type ListProps = {
  documents: readonly Document[];
  headers: DocumentTableHeader[];
};

const ListItem = ({
  document,
  headers
}: {
  document: Document;
  headers: DocumentTableHeader[];
}) => {
  const { getMicroCopy } = useSiteContext();
  const isLinkDocument = getIsLinkDocument(document);

  return (
    <StyledListItem>
      <StyledListTitleRow>
        <DocumentTitle document={document} disableRipple />
      </StyledListTitleRow>
      <StyledListRow>
        {headers.includes("typeCode") ? (
          <StyledListRowItem>
            <FieldTitle>
              {getMicroCopy(microCopy.DOCUMENT_LIBRARY_HEADERS_TYPE_CODE)}:
            </FieldTitle>{" "}
            <FieldValue>
              <abbr>{document.assetType.code}</abbr>
            </FieldValue>
          </StyledListRowItem>
        ) : null}
        {headers.includes("type") ? (
          <StyledListRowItem>
            <FieldTitle>
              {getMicroCopy(microCopy.DOCUMENT_LIBRARY_HEADERS_TYPE)}:
            </FieldTitle>{" "}
            <FieldValue>{document.assetType.name}</FieldValue>
          </StyledListRowItem>
        ) : null}
        <StyledListRowItem>
          <FieldTitle>
            {getMicroCopy(microCopy.DOCUMENT_LIBRARY_HEADERS_SIZE)}:
          </FieldTitle>
          <FieldValue data-testid={`document-table-size-${document.id}`}>
            {isLinkDocument
              ? "-"
              : filesize(getFileSizeByDocumentType(document))}
          </FieldValue>
        </StyledListRowItem>
        {headers.includes("productStatus") ? (
          <StyledListRowItem>
            <FieldTitle>
              {getMicroCopy(microCopy.DOCUMENT_LIBRARY_HEADERS_PRODUCT_STATUS)}:
            </FieldTitle>
            <FieldValue>
              {"approvalStatus" in document ? (
                <DocumentStatus status={document.approvalStatus}>
                  {getProductStatus(document, getMicroCopy)}
                </DocumentStatus>
              ) : (
                "-"
              )}
            </FieldValue>
          </StyledListRowItem>
        ) : null}
        {headers.includes("validityDate") ? (
          <StyledListRowItem>
            <FieldTitle>
              {getMicroCopy(microCopy.DOCUMENT_LIBRARY_HEADERS_VALIDITY_DATE)}:
            </FieldTitle>
            <FieldValue>{getValidityDate(document)}</FieldValue>
          </StyledListRowItem>
        ) : null}
      </StyledListRow>
      <StyledListRow>
        <Actions>
          {!isLinkDocument ? (
            <DownloadDocumentButton document={document} />
          ) : null}
          {document.__typename !== "PIMDocumentWithPseudoZip" ? (
            <CopyToClipboard
              id={document.id}
              url={getFileUrlByDocumentType(document)}
              title={document.title}
            />
          ) : null}
        </Actions>
      </StyledListRow>
    </StyledListItem>
  );
};

export const DocumentSimpleTableResultsMobile = ({
  documents,
  headers
}: ListProps): React.ReactElement => {
  return (
    <div>
      {documents.map((document) => (
        <ListItem headers={headers} document={document} key={document.id} />
      ))}
    </div>
  );
};
