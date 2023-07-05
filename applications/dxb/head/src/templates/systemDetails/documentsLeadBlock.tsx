import { DownloadList, LeadBlock } from "@bmi-digital/components";
import React, { useRef, useState } from "react";
import DocumentResultsFooter from "../../components/DocumentResultsFooter";
import DocumentSimpleTableResults from "../../components/DocumentSimpleTableResults";
import { SystemDocument } from "../../types/pim";
import {
  StyledDocumentLeadBlock,
  classes
} from "./styles/documentsLeadBlock.styles";

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
    <StyledDocumentLeadBlock>
      <LeadBlock.Card.Content>
        <div ref={resultsElement}>
          <DownloadList maxSize={GATSBY_DOCUMENT_DOWNLOAD_MAX_LIMIT * 1000000}>
            <div className={classes.tableContainer}>
              <DocumentSimpleTableResults
                documents={documents}
                headers={["add", "type", "title", "size", "actions"]}
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
    </StyledDocumentLeadBlock>
  );
};

export default DocumentsLeadBlock;
