import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React, { useMemo } from "react";
import { Data as AssetTypeData } from "../types/AssetType";
import { ProductDocument } from "../types/pim";
import groupBy from "../utils/groupBy";
import fileIconsMap from "./FileIconsMap";
import styles from "./styles/DocumentTechnicalTableResults.module.scss";
import DesktopDocumentTechnicalTableResults from "./_DesktopDocumentTechnicalTableResults";
import MobileDocumentTechnicalTableResults from "./_MobileDocumentTechnicalTableResults";

type Props = {
  documents: ProductDocument[];
  page: number;
  documentsPerPage: number;
};

export const groupDocuments = (
  documents: readonly ProductDocument[]
): [string, ProductDocument[]][] =>
  Object.entries(groupBy(documents, (document) => document.productBaseCode));

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
