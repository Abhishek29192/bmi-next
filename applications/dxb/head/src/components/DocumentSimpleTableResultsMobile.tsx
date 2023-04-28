import filesize from "filesize";
import React from "react";
import { DownloadList, DownloadListContextType } from "@bmi-digital/components";
import classnames from "classnames";
import { microCopy } from "../constants/microCopies";
import { Document, DocumentTableHeader } from "../types/Document";
import {
  getUniqueId,
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
  ActionBtnWrapper,
  ActionsRow,
  FieldTitle,
  FieldValue,
  StyledListItem,
  StyledListRow,
  StyledListRowItem,
  StyledListTitleRow,
  Divider,
  classes
} from "./styles/DocumentSimpleTableResultsMobileStyles";

type ListProps = {
  documents: readonly Document[];
  headers: DocumentTableHeader[];
  selectedDocuments: DownloadListContextType["list"];
};

const ListItem = ({
  document,
  headers,
  isSelected
}: {
  document: Document;
  headers: DocumentTableHeader[];
  isSelected: boolean;
}) => {
  const { getMicroCopy } = useSiteContext();
  const isLinkDocument = getIsLinkDocument(document);
  const size = getFileSizeByDocumentType(document);
  const isZipDocument = document.__typename === "PIMDocumentWithPseudoZip";

  return (
    <StyledListItem
      data-testid={`document-table-row-${document.id}`}
      className={classnames(isSelected && classes.selected)}
    >
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
      <ActionsRow>
        {!isLinkDocument ? (
          <ActionBtnWrapper>
            <DownloadDocumentButton document={document} />
          </ActionBtnWrapper>
        ) : null}
        {!isZipDocument ? (
          <ActionBtnWrapper>
            <CopyToClipboard
              id={document.id}
              url={getFileUrlByDocumentType(document)}
              title={document.title}
            />
          </ActionBtnWrapper>
        ) : null}
        <Divider />
        <DownloadList.Checkbox
          name={getUniqueId(document)}
          ariaLabel={`${getMicroCopy(microCopy.DOCUMENT_LIBRARY_DOWNLOAD)} ${
            document.title
          }`}
          value={isZipDocument ? document.documentList : document}
          fileSize={size}
          disabled={isLinkDocument}
        />
      </ActionsRow>
    </StyledListItem>
  );
};

export const DocumentSimpleTableResultsMobile = ({
  documents,
  headers,
  selectedDocuments
}: ListProps): React.ReactElement => {
  return (
    <div>
      {documents.map((document) => {
        const isSelected = Boolean(selectedDocuments[getUniqueId(document)]);
        return (
          <ListItem
            headers={headers}
            document={document}
            key={document.id}
            isSelected={isSelected}
          />
        );
      })}
    </div>
  );
};
