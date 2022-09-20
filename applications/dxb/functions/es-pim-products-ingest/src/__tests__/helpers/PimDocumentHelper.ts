import { EsPIMDocumentData } from "@bmi/elasticsearch-types";

export const createPimDocument = (
  esPimDocument?: Partial<EsPIMDocumentData>
): EsPIMDocumentData =>
  ({
    __typename: "PIMDocument",
    id: "pim-document-id",
    title: "pim-document-title",
    code: "productCode",
    CATEGORY: [
      {
        code: "parent-category-code",
        name: "name"
      }
    ],
    url: "http://localhost/pim-document-id",
    assetType: {
      name: "name",
      code: "code",
      pimCode: "pimCode"
    },
    fileSize: 1,
    format: "application/pdf",
    extension: "pdf",
    realFileName: "pim-document-id.pdf",
    titleAndSize: "titleAndSize",
    ...esPimDocument
  } as EsPIMDocumentData);
