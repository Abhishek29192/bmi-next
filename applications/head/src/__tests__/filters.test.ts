import { Data as DocumentResultsData } from "../components/DocumentResults";
import { Data as DocumentData } from "../components/Document";
import {
  PIMDocumentData,
  PIMLinkDocumentData
} from "../components/types/PIMDocumentBase";
import { generateUniqueDocuments, getDocumentFilters } from "../utils/filters";
import createPimDocument from "./PimDocumentHelper";
import createPimLinkDocument from "./PimLinkDocumentHelper";
import createContentfuldocument from "./ContentfulDocumentHelper";
import createProduct from "./PimDocumentProductHelper";
import createCategory from "./CategoryHelper";
import createClassification from "./ClassificationHelper";

describe("filters tests", () => {
  describe("generateUniqueDocuments tests", () => {
    describe("When result type is Simple", () => {
      describe("input documents are empty", () => {
        it("returns empty result list", () => {
          const result = generateUniqueDocuments("Simple", []);
          expect(result).toEqual([]);
        });
      });
      describe("input documents are NOT empty", () => {
        it("returns unique document list", () => {
          const inputDataItems: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

          const baseUrl: string = "http://localhost/document/library/";

          const contenfulDocument = createContentfuldocument({
            id: `contentful-doc-id`,
            asset: {
              file: {
                url: "",
                fileName: `contentful-doc-fileName`,
                contentType: "",
                details: { size: 9999 }
              }
            }
          });

          const pimLinkDocument = createPimLinkDocument({
            id: `pim-link-doc-id`,
            url: `${baseUrl}pim-link-doc-url`
          });

          const pimDocument = createPimDocument({
            id: `pim-doc-id`,
            url: `${baseUrl}pim-doc-url`
          });

          // create duplicate pim documents
          [1, 2, 3].map(() => inputDataItems.push(pimDocument));

          // create duplicate pim link documents
          [1, 2, 3].map(() => inputDataItems.push(pimLinkDocument));

          // create duplicate contentful documents
          [1, 2, 3].map(() => inputDataItems.push(contenfulDocument));

          const result = generateUniqueDocuments("Simple", inputDataItems);

          // unique documents for expected result
          const expectedResult: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();
          expectedResult.push(pimDocument);
          expectedResult.push(pimLinkDocument);
          expectedResult.push(contenfulDocument);

          expect(result).toEqual(expectedResult);
        });
      });
    });

    describe("When result type is NOT Simple", () => {
      describe("input documents are empty", () => {
        it("returns empty result list", () => {
          const result = generateUniqueDocuments("Technical", []);
          expect(result).toEqual([]);
        });
      });
      describe("input documents are NOT empty", () => {
        it("returns document list without filtering", () => {
          const inputDataItems: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

          const baseUrl: string = "http://localhost/document/library/";

          const contenfulDocument = createContentfuldocument({
            id: `contentful-doc-id`,
            asset: {
              file: {
                url: "",
                fileName: `contentful-doc-fileName`,
                contentType: "",
                details: { size: 9999 }
              }
            }
          });

          const pimLinkDocument = createPimLinkDocument({
            id: `pim-link-doc-id`,
            url: `${baseUrl}pim-link-doc-url`
          });

          const pimDocument = createPimDocument({
            id: `pim-doc-id`,
            url: `${baseUrl}pim-doc-url`
          });

          // create duplicate pim documents
          [1, 2, 3].map(() => inputDataItems.push(pimDocument));

          // create duplicate pim link documents
          [1, 2, 3].map(() => inputDataItems.push(pimLinkDocument));

          // create duplicate contentful documents
          [1, 2, 3].map(() => inputDataItems.push(contenfulDocument));

          const result = generateUniqueDocuments("Technical", inputDataItems);

          expect(result).toEqual(inputDataItems);
        });
      });
    });
  });

  describe("getDocumentFilters tests", () => {
    describe("When non supported arguments are passed for filters tests", () => {
      it("Then: returns NO filters", () => {
        const inputDataItems: DocumentResultsData =
          Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

        const baseUrl: string = "http://localhost/document/library/";

        const contenfulDocument = createContentfuldocument({
          id: `contentful-doc-id`,
          asset: {
            file: {
              url: "",
              fileName: `contentful-doc-fileName`,
              contentType: "",
              details: { size: 9999 }
            }
          }
        });

        const pimLinkDocument = createPimLinkDocument({
          id: `pim-link-doc-id`,
          url: `${baseUrl}pim-link-doc-url`
        });

        const pimDocument = createPimDocument({
          id: `pim-doc-id`,
          url: `${baseUrl}pim-doc-url`
        });

        // create duplicate pim documents
        [1, 2, 3].map(() => inputDataItems.push(pimDocument));

        // create duplicate pim link documents
        [1, 2, 3].map(() => inputDataItems.push(pimLinkDocument));

        // create duplicate contentful documents
        [1, 2, 3].map(() => inputDataItems.push(contenfulDocument));

        // ALL : Technical is not supported
        let result = getDocumentFilters(
          inputDataItems,
          "ALL",
          "Technical",
          "classificationNamespace"
        );
        expect(result).toEqual([]);

        // CMS : Technical is not supported
        result = getDocumentFilters(
          inputDataItems,
          "CMS",
          "Technical",
          "classificationNamespace"
        );
        expect(result).toEqual([]);
      });
    });

    describe("When 'PIM' document data is viewed in 'Simple' Page", () => {
      it("Then: returns brand and product family filters", () => {
        const inputDataItems: DocumentResultsData =
          Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

        const baseUrl: string = "http://localhost/document/library/";

        const pimDocument = createPimDocument({
          id: `pim-doc-id`,
          url: `${baseUrl}pim-doc-url`,
          product: createProduct({
            categories: [
              createCategory({ categoryType: "Brand" }),
              createCategory({ categoryType: "ProductFamily" })
            ],
            classifications: [createClassification()]
          })
        });

        const expectedResult = [
          {
            label: "filterLabels.brand",
            name: "brand",
            options: [
              {
                label: "category-name",
                value: "category-code"
              }
            ],
            value: []
          },
          {
            label: "filterLabels.productFamily",
            name: "productFamily",
            options: [
              {
                label: "category-name",
                value: "category-code"
              }
            ],
            value: []
          },
          undefined
        ];

        inputDataItems.push(pimDocument);
        let result = getDocumentFilters(
          inputDataItems,
          "PIM",
          "Simple",
          "classificationNamespace"
        );
        expect(result).toEqual(expectedResult);
      });
    });

    describe("When 'PIM' document data is viewed in 'Technical' Page", () => {
      it("Then: returns brand and product family filters", () => {
        const inputDataItems: DocumentResultsData =
          Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

        const baseUrl: string = "http://localhost/document/library/";

        const pimDocument = createPimDocument({
          id: `pim-doc-id`,
          url: `${baseUrl}pim-doc-url`,
          product: createProduct({
            categories: [
              createCategory({ categoryType: "Brand" }),
              createCategory({ categoryType: "ProductFamily" })
            ],
            classifications: [createClassification()]
          })
        });

        const expectedResult = [
          {
            label: "filterLabels.brand",
            name: "brand",
            options: [
              {
                label: "category-name",
                value: "category-code"
              }
            ],
            value: []
          },
          {
            label: "filterLabels.productFamily",
            name: "productFamily",
            options: [
              {
                label: "category-name",
                value: "category-code"
              }
            ],
            value: []
          }
        ];

        inputDataItems.push(pimDocument);
        let result = getDocumentFilters(
          inputDataItems,
          "PIM",
          "Technical",
          "classificationNamespace"
        );
        expect(result).toEqual(expectedResult);
      });
    });

    describe("When 'CMS' document data is viewed in 'Card Collection' Page", () => {
      it("Then: returns brand filters", () => {
        const inputDataItems: DocumentResultsData =
          Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

        const baseUrl: string = "http://localhost/document/library/";

        const pimDocument = createPimDocument({
          id: `pim-doc-id`,
          url: `${baseUrl}pim-doc-url`,
          product: createProduct({
            categories: [
              createCategory({ categoryType: "Brand" }),
              createCategory({ categoryType: "ProductFamily" })
            ],
            classifications: [createClassification()]
          })
        });

        const expectedResult = [
          {
            label: "filterLabels.brand",
            name: "brand",
            options: [
              {
                label: "category-name",
                value: "category-code"
              }
            ],
            value: []
          }
        ];

        inputDataItems.push(pimDocument);
        let result = getDocumentFilters(
          inputDataItems,
          "CMS",
          "Card Collection",
          "classificationNamespace"
        );
        expect(result).toEqual(expectedResult);
      });
    });

    describe("When 'CMS' document data is viewed in 'Simple' Page", () => {
      it("Then: returns brand filters", () => {
        const inputDataItems: DocumentResultsData =
          Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

        const baseUrl: string = "http://localhost/document/library/";

        const pimDocument = createPimDocument({
          id: `pim-doc-id`,
          url: `${baseUrl}pim-doc-url`,
          product: createProduct({
            categories: [
              createCategory({ categoryType: "Brand" }),
              createCategory({ categoryType: "ProductFamily" })
            ],
            classifications: [createClassification()]
          })
        });

        const expectedResult = [
          {
            label: "filterLabels.brand",
            name: "brand",
            options: [
              {
                label: "category-name",
                value: "category-code"
              }
            ],
            value: []
          },
          {
            label: "filterLabels.assetType",
            name: "contentfulAssetType",
            options: [
              {
                label: "asset-name",
                value: "asset-code"
              }
            ],
            value: []
          }
        ];

        inputDataItems.push(pimDocument);
        let result = getDocumentFilters(
          inputDataItems,
          "CMS",
          "Simple",
          "classificationNamespace"
        );
        expect(result).toEqual(expectedResult);
      });
    });

    describe("When 'ALL' document data is viewed in 'Simple' Page", () => {
      it("Then: returns brand filters", () => {
        const inputDataItems: DocumentResultsData =
          Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

        const baseUrl: string = "http://localhost/document/library/";

        const pimDocument = createPimDocument({
          id: `pim-doc-id`,
          url: `${baseUrl}pim-doc-url`,
          product: createProduct({
            categories: [
              createCategory({ categoryType: "Brand" }),
              createCategory({ categoryType: "ProductFamily" })
            ],
            classifications: [createClassification()]
          })
        });

        const expectedResult = [
          {
            label: "filterLabels.assetType",
            name: "contentfulAssetType",
            options: [
              {
                label: "asset-name",
                value: "asset-code"
              }
            ],
            value: []
          },
          {
            label: "filterLabels.brand",
            name: "brand",
            options: [
              {
                label: "category-name",
                value: "category-code"
              }
            ],
            value: []
          },
          {
            label: "filterLabels.productFamily",
            name: "productFamily",
            options: [
              {
                label: "category-name",
                value: "category-code"
              }
            ],
            value: []
          }
        ];

        inputDataItems.push(pimDocument);
        let result = getDocumentFilters(
          inputDataItems,
          "ALL",
          "Simple",
          "classificationNamespace"
        );
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
