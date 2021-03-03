import React, { useMemo } from "react";
import { groupBy, uniqBy } from "lodash";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { iconMap } from "@bmi/icon";
import { Data as PIMDocumentData } from "./PIMDocument";
import { Data as PIMLinkDocumentData } from "./PIMLinkDocument";
import DesktopDocumentTechnicalTableResults from "./_DesktopDocumentTechnicalTableResults";
import MobileDocumentTechnicalTableResults from "./_MobileDocumentTechnicalTableResults";
import styles from "./styles/DocumentTechnicalTableResults.module.scss";
import { Format } from "./types";

type Props = {
  documents: (PIMDocumentData | PIMLinkDocumentData)[];
  page: number;
  documentsPerPage: number;
};

const fileIconsMap: Record<Format, React.ComponentType> = {
  "application/pdf": iconMap.FilePDF,
  "image/jpg": iconMap.FileJPG,
  "image/jpeg": iconMap.FileJPEG,
  "image/png": iconMap.FilePNG
};

export const getCount = (documents: Props["documents"]): number => {
  return Object.entries(groupBy(documents, "product.name")).length;
};

const DocumentTechnicalTableResults = ({
  documents,
  page,
  documentsPerPage
}: Props) => {
  const documentsByProduct = Object.entries(
    groupBy(documents, "product.name")
  ).slice((page - 1) * documentsPerPage, page * documentsPerPage);
  const assetTypes = useMemo(
    () =>
      uniqBy(
        documents.map(({ assetType }) => assetType),
        "id"
      ),
    [documents]
  );

  if (assetTypes.length === 0) {
    return <p>A technical table cannot being shown with no asset types.</p>;
  }

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <div className={styles["DocumentTechnicalTableResults"]}>
      {matches ? (
        <DesktopDocumentTechnicalTableResults
          documentsByProduct={documentsByProduct}
          assetTypes={assetTypes}
          fileIconsMap={fileIconsMap}
        />
      ) : (
        <MobileDocumentTechnicalTableResults
          documentsByProduct={documentsByProduct}
          assetTypes={assetTypes}
          fileIconsMap={fileIconsMap}
        />
      )}
    </div>
  );
};

export default DocumentTechnicalTableResults;
