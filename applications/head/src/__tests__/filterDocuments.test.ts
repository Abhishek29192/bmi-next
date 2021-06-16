import { Data as DocumentResultsData } from "../components/DocumentResults";
import { Data as DocumentData } from "../components/Document";
import {
  PIMDocumentData,
  PIMLinkDocumentData
} from "../components/types/PIMDocumentBase";
import { filterDocuments } from "../utils/filters";
import createPimDocument from "./PimDocumentHelper";
import createPimLinkDocument from "./PimLinkDocumentHelper";
import createContentfulDocument from "./ContentfulDocumentHelper";
import createProduct from "./PimDocumentProductHelper";
import createCategory from "./CategoryHelper";
import createAssetType from "./AssetTypeHelper";
import {
  createBrandFilterCriteria,
  createProductFamilyFilterCriteria,
  createAssetTypeFilterCriteria
} from "./filterHelper";

describe("filter document tests", () => {
  describe("When no filters are provided", () => {
    it("Then: returns original results", () => {
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
          ]
        })
      });

      inputDataItems.push(pimDocument);
      let result = filterDocuments(inputDataItems, []);
      expect(result).toEqual(inputDataItems);
    });
  });
  describe("When querying field is invalid :: no matcher available", () => {
    it("Then: returns empty results", () => {
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
          ]
        })
      });

      inputDataItems.push(pimDocument);
      const result = filterDocuments(inputDataItems, [
        createProductFamilyFilterCriteria({
          name: "property_does_not_exist"
        })
      ]);
      expect(result).toEqual([]);
    });
  });

  describe("Brand filter tests", () => {
    describe("When brand filter is provided with PIM Documents", () => {
      describe("And document with matching filter does NOT exists", () => {
        it("Then: returns empty results", () => {
          const inputDataItems: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

          const baseUrl: string = "http://localhost/document/library/";

          const pimDocument = createPimDocument({
            id: `pim-doc-id-aero`,
            url: `${baseUrl}pim-doc-url-aero`,
            product: createProduct({
              categories: [
                createCategory({ categoryType: "Brand" }),
                createCategory({ categoryType: "ProductFamily" })
              ]
            })
          });

          inputDataItems.push(pimDocument);

          const pimLinkDocument = createPimLinkDocument({
            id: `pim-doc-id-ico`,
            url: `${baseUrl}pim-doc-url-ico`,
            product: createProduct({
              categories: [
                createCategory({ categoryType: "Brand", code: "Icopal" }),
                createCategory({ categoryType: "ProductFamily" })
              ]
            })
          });

          inputDataItems.push(pimLinkDocument);

          let result = filterDocuments(inputDataItems, [
            createBrandFilterCriteria()
          ]);

          expect(result).toEqual([]);
        });
      });
      describe("And document with single brand matching filter exists", () => {
        it("Then: returns filtered results", () => {
          const inputDataItems: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

          const baseUrl: string = "http://localhost/document/library/";

          const pimDocument = createPimDocument({
            id: `pim-doc-id-aero`,
            url: `${baseUrl}pim-doc-url-aero`,
            product: createProduct({
              categories: [
                createCategory({ categoryType: "Brand", code: "AeroDek" }),
                createCategory({ categoryType: "ProductFamily" }) // will be ignored
              ]
            })
          });

          inputDataItems.push(pimDocument);

          const pimLinkDocument = createPimLinkDocument({
            id: `pim-doc-id-ico`,
            url: `${baseUrl}pim-doc-url-ico`,
            product: createProduct({
              categories: [
                createCategory({ categoryType: "Brand", code: "AeroDek" }),
                createCategory({ categoryType: "ProductFamily" }) // will be ignored
              ]
            })
          });

          inputDataItems.push(pimLinkDocument);

          const contentfulDocument = createContentfulDocument({
            brand: "AeroDek"
          });

          inputDataItems.push(contentfulDocument);

          const result = filterDocuments(inputDataItems, [
            createBrandFilterCriteria()
          ]);

          const expectedResults: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();
          expectedResults.push(pimDocument);
          expectedResults.push(pimLinkDocument);
          expectedResults.push(contentfulDocument);

          expect(result).toEqual(expectedResults);
        });
      });
      describe("And PIM document with multiple brands matching filter exists", () => {
        it("Then: returns result when filtered by any of the brand names", () => {
          const inputDataItems: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

          const baseUrl: string = "http://localhost/document/library/";

          const pimDocument = createPimDocument({
            id: `pim-doc-id-aero`,
            url: `${baseUrl}pim-doc-url-aero`,
            product: createProduct({
              categories: [
                createCategory({ categoryType: "Brand", code: "AeroDek" }),
                createCategory({ categoryType: "Brand", code: "Icopal" }),
                createCategory({
                  categoryType: "Brand",
                  code: "someOtherBrand"
                })
              ]
            })
          });
          inputDataItems.push(pimDocument);

          let result = filterDocuments(inputDataItems, [
            createBrandFilterCriteria({
              value: ["AeroDek"]
            })
          ]);

          let expectedResults: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();
          expectedResults.push(pimDocument);

          expect(result).toEqual(expectedResults);

          // search for 'document with Icopal Brand
          result = filterDocuments(inputDataItems, [
            createBrandFilterCriteria({
              value: ["Icopal"]
            })
          ]);

          expectedResults =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();
          expectedResults.push(pimDocument);

          expect(result).toEqual(expectedResults);

          // search for 'document with both AeroDek and Icopal Brands
          result = filterDocuments(inputDataItems, [
            createBrandFilterCriteria({
              value: ["AeroDek", "Icopal"]
            })
          ]);

          expectedResults =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();
          expectedResults.push(pimDocument);

          expect(result).toEqual(expectedResults);
        });
      });
      describe("And PIM Link document with multiple brands matching filter exists", () => {
        it("Then: returns result when filtered by any of the brand names", () => {
          const inputDataItems: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

          const baseUrl: string = "http://localhost/document/library/";

          const pimLinkDocument = createPimLinkDocument({
            id: `pim-doc-id-ico`,
            url: `${baseUrl}pim-doc-url-ico`,
            product: createProduct({
              categories: [
                createCategory({ categoryType: "Brand", code: "AeroDek" }),
                createCategory({ categoryType: "Brand", code: "Icopal" })
              ]
            })
          });

          inputDataItems.push(pimLinkDocument);

          let result = filterDocuments(inputDataItems, [
            createBrandFilterCriteria({
              value: ["AeroDek"]
            })
          ]);

          let expectedResults: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();
          expectedResults.push(pimLinkDocument);

          expect(result).toEqual(expectedResults);

          // search for 'document with Icopal Brand
          result = filterDocuments(inputDataItems, [
            createBrandFilterCriteria({
              value: ["Icopal"]
            })
          ]);

          expectedResults =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();
          expectedResults.push(pimLinkDocument);

          expect(result).toEqual(expectedResults);

          // search for 'document with both AeroDek and Icopal Brands
          result = filterDocuments(inputDataItems, [
            createBrandFilterCriteria({
              value: ["AeroDek", "Icopal"]
            })
          ]);

          expectedResults =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();
          expectedResults.push(pimLinkDocument);

          expect(result).toEqual(expectedResults);
        });
      });
    });

    describe("When brand filter is provided with Contentful Documents", () => {
      describe("And document with matching filter does NOT exists", () => {
        it("Then: returns empty results", () => {
          const inputDataItems: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

          const contenfulDocument1 = createContentfulDocument({
            id: `contentful-doc-id`
          });

          inputDataItems.push(contenfulDocument1);

          const contenfulDocument2 = createContentfulDocument({
            id: `contentful-doc-id`,
            brand: "Icopal"
          });

          inputDataItems.push(contenfulDocument2);

          let result = filterDocuments(inputDataItems, [
            createBrandFilterCriteria()
          ]);

          expect(result).toEqual([]);
        });
      });
      describe("And document with matching filter exists", () => {
        it("Then: returns filtered results", () => {
          const inputDataItems: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

          const contenfulDocument1 = createContentfulDocument({
            id: `contentful-doc-id`,
            brand: "Icopal"
          });

          inputDataItems.push(contenfulDocument1);

          const contenfulDocument2 = createContentfulDocument({
            id: `contentful-doc-id`,
            brand: "AeroDek"
          });
          inputDataItems.push(contenfulDocument2);

          let result = filterDocuments(inputDataItems, [
            createBrandFilterCriteria({ value: ["AeroDek", "Icopal"] })
          ]);

          const expectedResults: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();
          expectedResults.push(contenfulDocument1);
          expectedResults.push(contenfulDocument2);

          expect(result).toEqual(expectedResults);
        });
      });
    });
  });

  describe("product family filter tests", () => {
    describe("When product family filter is provided with PIM Documents", () => {
      describe("And document product does not have any categories", () => {
        it("Then: returns empty results", () => {
          const inputDataItems: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

          const baseUrl: string = "http://localhost/document/library/";

          const pimDocument = createPimDocument({
            id: `pim-doc-id-aero`,
            url: `${baseUrl}pim-doc-url-aero`,
            product: createProduct({
              categories: null
            })
          });

          inputDataItems.push(pimDocument);

          const pimLinkDocument = createPimLinkDocument({
            id: `pim-doc-id-ico`,
            url: `${baseUrl}pim-doc-url-ico`,
            product: createProduct({
              categories: null
            })
          });

          inputDataItems.push(pimLinkDocument);

          let result = filterDocuments(inputDataItems, [
            createProductFamilyFilterCriteria()
          ]);

          expect(result).toEqual([]);
        });
      });
      describe("And document with matching filter does NOT exists", () => {
        it("Then: returns empty results", () => {
          const inputDataItems: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

          const baseUrl: string = "http://localhost/document/library/";

          const pimDocument = createPimDocument({
            id: `pim-doc-id-aero`,
            url: `${baseUrl}pim-doc-url-aero`,
            product: createProduct({
              categories: [
                createCategory({ categoryType: "Brand" }),
                createCategory({ categoryType: "ProductFamily" })
              ]
            })
          });

          inputDataItems.push(pimDocument);

          const pimLinkDocument = createPimLinkDocument({
            id: `pim-doc-id-ico`,
            url: `${baseUrl}pim-doc-url-ico`,
            product: createProduct({
              categories: [
                createCategory({ categoryType: "Brand" }),
                createCategory({ categoryType: "ProductFamily" })
              ]
            })
          });

          inputDataItems.push(pimLinkDocument);

          const contentfulDocument = createContentfulDocument();

          inputDataItems.push(contentfulDocument);

          let result = filterDocuments(inputDataItems, [
            createProductFamilyFilterCriteria()
          ]);

          expect(result).toEqual([]);
        });
      });
      describe("And document with single productFamily matching filter exists", () => {
        it("Then: returns filtered results", () => {
          const inputDataItems: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

          const baseUrl: string = "http://localhost/document/library/";

          const pimDocument = createPimDocument({
            id: `pim-doc-id-aero`,
            url: `${baseUrl}pim-doc-url-aero`,
            product: createProduct({
              categories: [
                createCategory({ categoryType: "Brand" }),
                createCategory({
                  categoryType: "ProductFamily",
                  code: "AeroDek_Quadro_Plus"
                })
              ]
            })
          });

          inputDataItems.push(pimDocument);

          const pimLinkDocument = createPimLinkDocument({
            id: `pim-doc-id-ico`,
            url: `${baseUrl}pim-doc-url-ico`,
            product: createProduct({
              categories: [
                createCategory({ categoryType: "Brand" }),
                createCategory({
                  categoryType: "ProductFamily",
                  code: "AeroDek_Quadro_Plus"
                })
              ]
            })
          });

          inputDataItems.push(pimLinkDocument);

          const pimLinkDocument2 = createPimLinkDocument({
            id: `pim-doc-id-ico`,
            url: `${baseUrl}pim-doc-url-ico`,
            product: createProduct({
              categories: [
                createCategory({
                  categoryType: "ProductFamily",
                  code: "AeroDek_Quadro_Plus_2"
                })
              ]
            })
          });

          inputDataItems.push(pimLinkDocument2);

          let result = filterDocuments(inputDataItems, [
            createProductFamilyFilterCriteria()
          ]);

          const expectedResults: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();
          expectedResults.push(pimDocument);
          expectedResults.push(pimLinkDocument);

          expect(result).toEqual(expectedResults);
        });
      });
      describe("And PIM documents with multiple productFamily matching filter exists", () => {
        it("Then: returns filtered results", () => {
          const inputDataItems: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

          const baseUrl: string = "http://localhost/document/library/";

          const pimDocument = createPimDocument({
            id: `pim-doc-id-aero`,
            url: `${baseUrl}pim-doc-url-aero`,
            product: createProduct({
              categories: [
                createCategory({
                  categoryType: "ProductFamily",
                  code: "AeroDek_Quadro_Plus"
                }),
                createCategory({
                  categoryType: "ProductFamily",
                  code: "product_family_2"
                })
              ]
            })
          });

          inputDataItems.push(pimDocument);

          // when searched with first product family in search filter criteria
          let result = filterDocuments(inputDataItems, [
            createProductFamilyFilterCriteria({
              value: ["AeroDek_Quadro_Plus"]
            })
          ]);

          let expectedResults: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();
          expectedResults.push(pimDocument);
          expect(result).toEqual(expectedResults);

          // when searched with second product family in search filter criteria
          result = filterDocuments(inputDataItems, [
            createProductFamilyFilterCriteria({
              value: ["product_family_2"]
            })
          ]);

          expect(result).toEqual(expectedResults);

          // when searched with both product family in search filter criteria
          result = filterDocuments(inputDataItems, [
            createProductFamilyFilterCriteria({
              value: ["AeroDek_Quadro_Plus", "product_family_2"]
            })
          ]);

          expect(result).toEqual(expectedResults);
        });
      });
      describe("And PIM LINK documents with multiple product family matching filter exists", () => {
        it("Then: returns filtered results", () => {
          const inputDataItems: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

          const baseUrl: string = "http://localhost/document/library/";

          const pimLinkDocument = createPimLinkDocument({
            id: `pim-doc-id-ico`,
            url: `${baseUrl}pim-doc-url-ico`,
            product: createProduct({
              categories: [
                createCategory({
                  categoryType: "ProductFamily",
                  code: "AeroDek_Quadro_Plus"
                }),
                createCategory({
                  categoryType: "ProductFamily",
                  code: "product_family_2"
                })
              ]
            })
          });

          inputDataItems.push(pimLinkDocument);

          // when searched with first product family in search filter criteria
          let result = filterDocuments(inputDataItems, [
            createProductFamilyFilterCriteria({
              value: ["AeroDek_Quadro_Plus"]
            })
          ]);

          let expectedResults: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();
          expectedResults.push(pimLinkDocument);
          expect(result).toEqual(expectedResults);

          // when searched with second product family in search filter criteria
          result = filterDocuments(inputDataItems, [
            createProductFamilyFilterCriteria({
              value: ["product_family_2"]
            })
          ]);

          expect(result).toEqual(expectedResults);

          // when searched with both product family in search filter criteria
          result = filterDocuments(inputDataItems, [
            createProductFamilyFilterCriteria({
              value: ["AeroDek_Quadro_Plus", "product_family_2"]
            })
          ]);

          expect(result).toEqual(expectedResults);
        });
      });
    });
  });

  describe("asset type filter tests", () => {
    describe("When filter is provided with Contentful Documents", () => {
      describe("And document with matching filter does NOT exists", () => {
        it("Then: returns empty results", () => {
          const inputDataItems: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

          const contenfulDocument1 = createContentfulDocument({
            id: `contentful-doc-id`
          });

          inputDataItems.push(contenfulDocument1);

          const contenfulDocument2 = createContentfulDocument({
            id: `contentful-doc-id`
          });

          inputDataItems.push(contenfulDocument2);

          let result = filterDocuments(inputDataItems, [
            createAssetTypeFilterCriteria()
          ]);

          expect(result).toEqual([]);
        });
      });
      describe("And document with matching filter exists", () => {
        it("Then: returns filtered results", () => {
          const inputDataItems: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

          const contenfulDocument1 = createContentfulDocument({
            id: `contentful-doc-id`,
            assetType: createAssetType({ code: "AeroDek_Quadro_Plus" })
          });

          inputDataItems.push(contenfulDocument1);

          const contenfulDocument2 = createContentfulDocument({
            id: `contentful-doc-id`,
            assetType: createAssetType({ code: "AeroDek_Quadro_Plus" })
          });
          inputDataItems.push(contenfulDocument2);

          let result = filterDocuments(inputDataItems, [
            createAssetTypeFilterCriteria({ value: ["AeroDek_Quadro_Plus"] })
          ]);

          const expectedResults: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();
          expectedResults.push(contenfulDocument1);
          expectedResults.push(contenfulDocument2);

          expect(result).toEqual(expectedResults);
        });
      });
    });
  });
});
