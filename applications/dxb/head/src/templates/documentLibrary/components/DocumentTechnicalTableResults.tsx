import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React, { useMemo } from "react";
import { PimProductDocument } from "@bmi/elasticsearch-types";
import fileIconsMap from "../../../components/FileIconsMap";
import { groupDistinctBy } from "../../../utils/product-filters";
import { AssetType } from "../types";
import styles from "./styles/DocumentTechnicalTableResults.module.scss";
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

  if (assetTypes.length === 0) {
    return <p>A technical table cannot being shown with no asset types.</p>;
  }

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <div className={styles["DocumentTechnicalTableResults"]}>
      {matches ? (
        <DesktopDocumentTechnicalTableResults
          documentsByProduct={allDocumentsGrouped}
          assetTypes={assetTypes}
          fileIconsMap={fileIconsMap}
        />
      ) : (
        <MobileDocumentTechnicalTableResults
          documentsByProduct={allDocumentsGrouped}
          assetTypes={assetTypes}
          fileIconsMap={fileIconsMap}
        />
      )}
    </div>
  );
};

export default DocumentTechnicalTableResults;
