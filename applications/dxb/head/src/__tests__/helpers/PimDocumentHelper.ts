import {
  ProductDocument as PIMDocument,
  PseudoZipPIMDocument
} from "../../types/pim";
import createAssetType from "./AssetTypeHelper";

const createPimDocument = (
  pimDocument?: Partial<PIMDocument>
): PIMDocument => ({
  assetType: createAssetType(),
  extension: "pdf",
  fileSize: 10,
  format: "application/pdf",
  id: "pim-document",
  isLinkDocument: false,
  realFileName: "pim-document.pdf",
  title: "Pim Document",
  url: "http://pimDocument",
  __typename: "PIMDocument",
  productName: "product-name",
  productBaseCode: "product-base-code",
  productCategories: [],
  productFilters: [],
  ...pimDocument
});

export const createPseudoZipDocument = (
  document?: Partial<PseudoZipPIMDocument>
): PseudoZipPIMDocument => ({
  __typename: "PIMDocumentWithPseudoZip",
  title: "asset-name",
  assetType: createAssetType(),
  fileSize: 100,
  format: "application/zip",
  id: "pim-pseudo-document",
  isLinkDocument: false,
  productName: "product-name",
  productBaseCode: "product-base-code",
  documentList: [
    createPimDocument({
      id: "id-1",
      assetType: createAssetType({ pimCode: "ASSEMBLY_INSTRUCTIONS" })
    }),
    createPimDocument({
      id: "id-2",
      assetType: createAssetType({ pimCode: "ASSEMBLY_INSTRUCTIONS" })
    }),
    createPimDocument({
      id: "id-3",
      assetType: createAssetType({ pimCode: "AWARDS" })
    }),
    createPimDocument({
      id: "id-3",
      assetType: createAssetType({ pimCode: "TECHNICAL_DRAWINGS" })
    })
  ]
});

export default createPimDocument;
