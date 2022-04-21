import { Document, ProductDocument, SystemDocument } from "./types";

const createDocument = (document?: Partial<Document>): Document => ({
  assetType: "ASSEMBLY_INSTRUCTIONS",
  extension: "pdf",
  fileSize: 10,
  format: "application/pdf",
  id: "id-1",
  isLinkDocument: false,
  realFileName: "real-file-name.pdf",
  title: "title",
  url: "http://localhost:8000/real-file-name.pdf",
  ...document
});

export const createProductDocument = (
  productDocument?: Partial<ProductDocument>
): ProductDocument => ({
  ...createDocument(productDocument),
  productBaseCode: "product-base-code",
  productName: "Product Name",
  productCategories: [
    {
      code: "product-category-code",
      parentCategoryCode: "product-category-parent-category-code"
    }
  ],
  ...productDocument
});

export const createSystemDocument = (
  systemDocument?: Partial<SystemDocument>
): SystemDocument => ({
  ...createDocument(systemDocument),
  ...systemDocument
});

export default createDocument;
