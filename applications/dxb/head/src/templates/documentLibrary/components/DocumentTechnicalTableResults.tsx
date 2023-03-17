import { PimProductDocument } from "@bmi/elasticsearch-types";
import React, { useMemo } from "react";
import { groupDistinctBy } from "../../../utils/product-filters";
import { AssetType } from "../types";
import { useIsMobileDevice } from "../../../utils/useIsMobileDevice";
import { Root } from "./DocumentTechnicalTableResultsStyles";
import DesktopDocumentTechnicalTableResults from "./_DesktopDocumentTechnicalTableResults";
import MobileDocumentTechnicalTableResults from "./_MobileDocumentTechnicalTableResults";

type Props = {
  documents: PimProductDocument[];
  assetTypes: AssetType[];
};

export const groupDocuments = (
  documents: readonly PimProductDocument[]
): [string, PimProductDocument[]][] => {
  return Object.entries(
    groupDistinctBy(documents, "productBaseCode", "realFileName")
  );
};

const DocumentTechnicalTableResults = ({ documents, assetTypes }: Props) => {
  const allDocumentsGrouped = useMemo(
    () => groupDocuments(documents),
    [documents]
  );
  const matches = useIsMobileDevice();

  if (assetTypes.length === 0) {
    return <p>A technical table cannot being shown with no asset types.</p>;
  }

  return (
    <Root data-testid="tech-results-table">
      {matches ? (
        <DesktopDocumentTechnicalTableResults
          documentsByProduct={allDocumentsGrouped}
          assetTypes={assetTypes}
        />
      ) : (
        <MobileDocumentTechnicalTableResults
          documentsByProduct={allDocumentsGrouped}
          assetTypes={assetTypes}
        />
      )}
    </Root>
  );
};

export default DocumentTechnicalTableResults;
