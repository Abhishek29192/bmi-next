import { ProductDocument } from "../pim";

const createProductDocument = (
  productDocument?: Partial<ProductDocument>
): ProductDocument => ({
  parent: null,
  children: [],
  internal: {
    type: "PIMDocument",
    contentDigest: "digest",
    owner: "contentful"
  },
  __typename: "PIMDocument",
  assetType___NODE: "asset-type",
  extension: "pdf",
  fileSize: 10,
  format: "application/pdf",
  id: "pim-document",
  isLinkDocument: false,
  realFileName: "pim-document.pdf",
  title: "Pim Document",
  url: "http://pimDocument",
  productBaseCode: "product-base-code",
  productName: "product-name",
  productCategories: [
    {
      code: "category-code",
      parentCategoryCode: "parent-category-code"
    }
  ],
  ...productDocument
});

export default createProductDocument;
