import React, { useState, useRef } from "react";
import { LeadBlock } from "@bmi/components";
import { DownloadList } from "@bmi/components";
import DocumentSimpleTableResults from "../../components/DocumentSimpleTableResults";
import DocumentResultsFooter, {
  handleDownloadClick
} from "../../components/DocumentResultsFooter";
import { DocumentData } from "./types";
import styles from "./styles/documentsLeadBlock.module.scss";

type Props = {
  documents: DocumentData[];
};

const DOCUMENTS_PER_PAGE = 24;
const GATSBY_DOCUMENT_DOWNLOAD_MAX_LIMIT =
  +process.env.GATSBY_DOCUMENT_DOWNLOAD_MAX_LIMIT || 100;

const DocumnetsLeadBlock = ({ documents }: Props) => {
  const resultsElement = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const filteredDocuments = documents.filter(
    (doc) =>
      (doc.assetType.pimCode !== "VIDEO" &&
        doc.assetType.pimCode !== "FIXING_TOOL" &&
        doc.assetType.pimCode !== "SPECIFICATION") ||
      doc.asset.file.details.size
  );
  const count = Math.ceil(filteredDocuments.length / DOCUMENTS_PER_PAGE);
  const handlePageChange = (_, page) => {
    const scrollY = resultsElement.current
      ? resultsElement.current.offsetTop - 200
      : 0;
    window.scrollTo(0, scrollY);
    setPage(page);
  };

  return (
    <LeadBlock.Card.Section>
      <LeadBlock.Card.Content>
        <div ref={resultsElement}>
          <DownloadList maxSize={GATSBY_DOCUMENT_DOWNLOAD_MAX_LIMIT * 1048576}>
            <div className={styles["tableContainer"]}>
              <DocumentSimpleTableResults
                documents={filteredDocuments}
                page={page}
                documentsPerPage={DOCUMENTS_PER_PAGE}
                headers={["type", "title", "download", "add"]}
              />
            </div>
            <DocumentResultsFooter
              page={page}
              count={count}
              onDownloadClick={handleDownloadClick}
              onPageChange={handlePageChange}
            />
          </DownloadList>
        </div>
      </LeadBlock.Card.Content>
    </LeadBlock.Card.Section>
  );
};

export default DocumnetsLeadBlock;
