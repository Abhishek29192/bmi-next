import { PimSystemDocument } from "./types";

export const createFullyPopulatedPimSystemDocument = (
  pimSystemDocument?: Partial<PimSystemDocument>
): PimSystemDocument => ({
  ...createPimSystemDocument(),
  format: "application/pdf",
  ...pimSystemDocument
});

const createPimSystemDocument = (
  pimSystemDocument?: Partial<PimSystemDocument>
): PimSystemDocument => ({
  __typename: "PIMSystemDocument",
  id: "pim-document-id",
  title: "pim document title",
  url: "http://localhost:9000/document.pdf",
  assetType: {
    code: "asset-type-code",
    name: "asset type name",
    pimCode: "asset-type-pim-code"
  },
  isLinkDocument: false,
  productBaseCode: "product-base-code",
  productName: "product name",
  noIndex: false,
  fileSize: 1,
  extension: "pdf",
  realFileName: "document.pdf",
  titleAndSize: "pim document title_1",
  ...pimSystemDocument
});

export default createPimSystemDocument;
