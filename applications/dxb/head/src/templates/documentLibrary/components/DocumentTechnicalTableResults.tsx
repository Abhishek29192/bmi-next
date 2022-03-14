import { PimProductDocument } from "@bmi/elasticsearch-types";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React, { useMemo } from "react";
import fileIconsMap from "../../../components/FileIconsMap";
import { useStyles } from "../../../components/styles/DocumentTechnicalTableResultsStyles";
import { groupDistinctBy } from "../../../utils/product-filters";
import { AssetType } from "../types";
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
  const classes = useStyles();
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
    <div className={classes.root}>
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
