import { PimProductDocument } from "./types";

export const createFullyPopulatedPimProductDocument = (
  pimProductDocument?: Partial<PimProductDocument>
): PimProductDocument => ({
  ...createPimProductDocument(),
  format: "application/pdf",
  ...pimProductDocument
});

const createPimProductDocument = (
  pimProductDocument?: Partial<PimProductDocument>
): PimProductDocument => ({
  __typename: "PIMDocument",
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
  ...pimProductDocument
});

export default createPimProductDocument;
