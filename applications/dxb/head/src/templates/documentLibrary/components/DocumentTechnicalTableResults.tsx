import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React, { useMemo } from "react";
import fileIconsMap from "../../../components/FileIconsMap";
import { ContentfulAssetType as AssetTypeData } from "../../../types/AssetType";
import { ProductDocument } from "../../../types/pim";
import { groupDistinctBy } from "../../../utils/product-filters";
import styles from "./styles/DocumentTechnicalTableResults.module.scss";
import DesktopDocumentTechnicalTableResults from "./_DesktopDocumentTechnicalTableResults";
import MobileDocumentTechnicalTableResults from "./_MobileDocumentTechnicalTableResults";

type Props = {
  documents: ProductDocument[];
};

export const groupDocuments = (
  documents: readonly ProductDocument[]
): [string, ProductDocument[]][] => {
  return Object.entries(
    groupDistinctBy(documents, "productBaseCode", "realFileName")
  );
};

export const getCount = (documents: Props["documents"]): number => {
  return groupDocuments(documents).length;
};

const DocumentTechnicalTableResults = ({ documents }: Props) => {
  // TODO: What on earth is this doing?!
  const assetTypes = useMemo(
    () =>
      documents
        .map(({ assetType }) => assetType)
        .reduce<AssetTypeData[]>((assetTypes, assetType) => {
          if (assetType) {
            assetTypes.find((type) => type.id === assetType.id) ||
              assetTypes.push({
                __typename: "ContentfulAssetType",
                code: assetType.code,
                id: assetType.id,
                name: assetType.name,
                pimCode: assetType.pimCode,
                description: null
              });
          }
          return assetTypes;
        }, []),
    [documents]
  );

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
