import React, { useMemo } from "react";
import { groupBy, uniqBy } from "lodash";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import {
  PIMDocumentData,
  PIMLinkDocumentData
} from "../components/types/PIMDocumentBase";
import DesktopDocumentTechnicalTableResults from "./_DesktopDocumentTechnicalTableResults";
import MobileDocumentTechnicalTableResults from "./_MobileDocumentTechnicalTableResults";
import styles from "./styles/DocumentTechnicalTableResults.module.scss";
import fileIconsMap from "./FileIconsMap";

type Props = {
  documents: (PIMDocumentData | PIMLinkDocumentData)[];
  page: number;
  documentsPerPage: number;
};

const groupDocuments = (
  documents: (PIMDocumentData | PIMLinkDocumentData)[]
): [string, (PIMDocumentData | PIMLinkDocumentData)[]][] =>
  Object.entries(groupBy(documents, "product.code"));

export const getCount = (documents: Props["documents"]): number => {
  return groupDocuments(documents).length;
};

const DocumentTechnicalTableResults = ({
  documents,
  page,
  documentsPerPage
}: Props) => {
  const documentsByProduct = groupDocuments(documents).slice(
    (page - 1) * documentsPerPage,
    page * documentsPerPage
  );
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
  const matches = useMediaQuery(theme.breakpoints.up("lg"));

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
