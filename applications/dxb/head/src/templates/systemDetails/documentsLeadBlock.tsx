import { DownloadList, LeadBlock } from "@bmi/components";
import React, { useRef, useState } from "react";
import DocumentResultsFooter from "../../components/DocumentResultsFooter";
import DocumentSimpleTableResults from "../../components/DocumentSimpleTableResults";
import { SystemDocument } from "../../types/pim";
import styles from "./styles/documentsLeadBlock.module.scss";

type Props = {
  documents: readonly SystemDocument[];
};

const DOCUMENTS_PER_PAGE = 24;
const GATSBY_DOCUMENT_DOWNLOAD_MAX_LIMIT =
  +process.env.GATSBY_DOCUMENT_DOWNLOAD_MAX_LIMIT || 100;

const DocumentsLeadBlock = ({ documents: initialDocuments }: Props) => {
  const resultsElement = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const filteredDocuments = initialDocuments.filter(
    (doc) =>
      (doc.assetType.pimCode !== "VIDEO" &&
        doc.assetType.pimCode !== "FIXING_TOOL" &&
        doc.assetType.pimCode !== "SPECIFICATION") ||
      doc.fileSize
  );
  const [documents, setDocuments] = useState(filteredDocuments.slice(0, 24));
  const count = Math.ceil(filteredDocuments.length / DOCUMENTS_PER_PAGE);
  const handlePageChange = (_, page) => {
    const scrollY = resultsElement.current
      ? resultsElement.current.offsetTop - 200
      : 0;
    window.scrollTo(0, scrollY);
    setPage(page);
    setDocuments(filteredDocuments.slice(page, (page + 1) * 24));
  };

  return (
    <LeadBlock.Card.Section>
      <LeadBlock.Card.Content>
        <div ref={resultsElement}>
          <DownloadList maxSize={GATSBY_DOCUMENT_DOWNLOAD_MAX_LIMIT * 1048576}>
            <div className={styles["tableContainer"]}>
              <DocumentSimpleTableResults
                documents={documents}
                headers={["type", "title", "download", "add"]}
              />
            </div>
            <DocumentResultsFooter
              page={page}
              count={count}
              onPageChange={handlePageChange}
            />
          </DownloadList>
        </div>
      </LeadBlock.Card.Content>
    </LeadBlock.Card.Section>
  );
};

export default DocumentsLeadBlock;
