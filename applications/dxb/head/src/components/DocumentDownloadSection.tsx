import { DownloadList, Section, replaceSpaces } from "@bmi-digital/components";
import { graphql } from "gatsby";
import React, { useRef, useState } from "react";
import { useConfig } from "../contexts/ConfigProvider";
import {
  ContentfulDocument as DocumentData,
  DocumentTableHeader
} from "../types/Document";
import DocumentResultsFooter from "./DocumentResultsFooter";
import DocumentSimpleTableResults from "./DocumentSimpleTableResults";
import RichText, { RichTextData } from "./RichText";

const DOCUMENTS_PER_PAGE = 24;
const TABLE_HEADERS: DocumentTableHeader[] = [
  "add",
  "title",
  "size",
  "actions"
];

export type Data = {
  __typename: "ContentfulDocumentDownloadSection";
  title: string | null;
  description: RichTextData | null;
  documents: DocumentData[];
};
const DocumentDownloadSection = ({
  data: { title, description, documents: allDocuments }
}: {
  data: Data;
}) => {
  const [page, setPage] = useState(1);
  const [documents, setDocuments] = useState(
    allDocuments.slice(0, DOCUMENTS_PER_PAGE)
  );
  const { documentDownloadMaxLimit } = useConfig();
  const documentsTable = useRef<HTMLDivElement>(null);
  const count = Math.ceil(allDocuments.length / DOCUMENTS_PER_PAGE);
  const maxSize = (documentDownloadMaxLimit || 0) * 1000000;

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    const scrollY = documentsTable.current
      ? documentsTable.current.offsetTop - 200
      : 0;
    window.scrollTo(0, scrollY);
    setPage(page);
    setDocuments(
      allDocuments.slice(
        (page - 1) * DOCUMENTS_PER_PAGE,
        page * DOCUMENTS_PER_PAGE
      )
    );
  };

  return (
    <Section
      backgroundColor="white"
      data-testid={`document-download-section-${replaceSpaces(title)}`}
    >
      {title && <Section.Title>{title}</Section.Title>}
      {description && (
        <div style={{ marginBottom: "40px" }}>
          <RichText document={description} />
        </div>
      )}
      {documents.length > 0 && (
        <div
          ref={documentsTable}
          data-testid={"document-download-section-table"}
        >
          <DownloadList maxSize={maxSize}>
            <DocumentSimpleTableResults
              documents={documents}
              headers={TABLE_HEADERS}
            />
            <DocumentResultsFooter
              page={page}
              count={count}
              onPageChange={handlePageChange}
            />
          </DownloadList>
        </div>
      )}
    </Section>
  );
};

export default DocumentDownloadSection;

export const query = graphql`
  fragment DocumentDownloadSectionFragment on ContentfulDocumentDownloadSection {
    title
    description {
      ...RichTextFragment
    }
    documents {
      ...DocumentFragment
    }
  }
`;
