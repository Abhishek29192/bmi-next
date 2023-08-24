import { PimProductDocument } from "@bmi/elasticsearch-types";
import React, { useMemo } from "react";
import { groupDistinctBy } from "../../../utils/product-filters";
import { AssetType } from "../types";
import { Root } from "./DocumentTechnicalTableResultsStyles";
import TechnicalTableResultsAccordion from "./_TechnicalTableResultsAccordion";

type Props = {
  documents: PimProductDocument[];
  assetTypes: AssetType[];
  pageNumber?: number;
};

export const groupDocuments = (
  documents: readonly PimProductDocument[]
): [string, PimProductDocument[]][] => {
  return Object.entries(
    groupDistinctBy(documents, "productBaseCode", "realFileName")
  );
};

const DocumentTechnicalTableResults = ({
  documents,
  assetTypes,
  pageNumber
}: Props) => {
  const allDocumentsGrouped = useMemo(
    () =>
      groupDocuments(documents).filter(
        ([_, documents]) => documents.length > 0
      ),
    [documents]
  );

  if (assetTypes.length === 0) {
    return <p>A technical table cannot being shown with no asset types.</p>;
  }

  return (
    <Root data-testid="tech-results-accordion">
      <TechnicalTableResultsAccordion
        documentsByProduct={allDocumentsGrouped}
        assetTypes={assetTypes}
        pageNumber={pageNumber}
      />
    </Root>
  );
};

export default DocumentTechnicalTableResults;
