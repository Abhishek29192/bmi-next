import { ContentfulDocument as DocumentData } from "../types/Document";
import { ProductDocument as PIMDocument } from "../types/pim";
import {
  clearFilterValues,
  filterDocuments,
  updateFilterValue
} from "../utils/filters";
import createAssetType from "./helpers/AssetTypeHelper";
import createContentfulDocument from "./helpers/ContentfulDocumentHelper";
import {
  createAssetTypeFilterCriteria,
  createBrandFilterCriteria,
  createProductFamilyFilterCriteria
} from "./helpers/filterHelper";
import createPimDocument from "./helpers/PimDocumentHelper";

describe("updateFilterValue tests", () => {
  describe("When updateFilterValue is requested", () => {
    it("Then: returns updated filters", () => {
      const results = updateFilterValue(
        [createBrandFilterCriteria()],
        "brand",
        "Icopal",
        true
      );
      expect(results).toMatchSnapshot();
    });
  });

  describe("When non checked updateFilterValue is requested", () => {
    it("Then: returns updated filters", () => {
      const results = updateFilterValue(
        [createBrandFilterCriteria()],
        "brand",
        "AeroDek",
        true
      );
      expect(results).toMatchSnapshot();
    });
  });
});

describe("clearFilterValues tests", () => {
  describe("When clearFilterValues is requested", () => {
    it("Then: returns correct results", () => {
      const results = clearFilterValues([]);
      expect(results).toMatchSnapshot();
    });
  });
});

describe("filter document tests", () => {
  describe("When no filters are provided", () => {
    it("Then: returns original results", () => {
      const inputDataItems: (PIMDocument | DocumentData)[] = Array<
        PIMDocument | DocumentData
      >();

      const baseUrl = "http://localhost/document/library/";

      const pimDocument = createPimDocument({
        id: `pim-doc-id`,
        url: `${baseUrl}pim-doc-url`
      });

      inputDataItems.push(pimDocument);
      const result = filterDocuments(inputDataItems, []);
      expect(result).toEqual(inputDataItems);
    });
  });
  describe("When querying field is invalid :: no matcher available", () => {
    it("Then: returns empty results", () => {
      const inputDataItems: (PIMDocument | DocumentData)[] = Array<
        PIMDocument | DocumentData
      >();

      const baseUrl = "http://localhost/document/library/";

      const pimDocument = createPimDocument({
        id: `pim-doc-id`,
        url: `${baseUrl}pim-doc-url`,
        productCategories: []
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
          const inputDataItems: (PIMDocument | DocumentData)[] = Array<
            PIMDocument | DocumentData
          >();

          const baseUrl = "http://localhost/document/library/";

          const pimDocument = createPimDocument({
            id: `pim-doc-id-aero`,
            url: `${baseUrl}pim-doc-url-aero`,
            productFilters: []
          });

          inputDataItems.push(pimDocument);

          const pimLinkDocument = createPimDocument({
            id: `pim-doc-id-ico`,
            url: `${baseUrl}pim-doc-url-ico`,
            isLinkDocument: true,
            productFilters: []
          });

          inputDataItems.push(pimLinkDocument);

          const result = filterDocuments(inputDataItems, [
            createBrandFilterCriteria()
          ]);

          expect(result).toEqual([]);
        });
      });
      describe("And document with single brand matching filter exists", () => {
        it("Then: returns filtered results", () => {
          const inputDataItems: (PIMDocument | DocumentData)[] = Array<
            PIMDocument | DocumentData
          >();

          const baseUrl = "http://localhost/document/library/";

          const pimDocument = createPimDocument({
            id: `pim-doc-id-aero`,
            url: `${baseUrl}pim-doc-url-aero`,
            productFilters: [
              {
                filterCode: "Brand",
                value: "AeroDek",
                code: "Brand"
              }
            ],
            productCategories: []
          });

          inputDataItems.push(pimDocument);

          const pimLinkDocument = createPimDocument({
            id: `pim-doc-id-ico`,
            url: `${baseUrl}pim-doc-url-ico`,
            isLinkDocument: true,
            productFilters: [
              {
                filterCode: "Brand",
                value: "AeroDek",
                code: "Brand"
              }
            ],
            productCategories: []
          });

          inputDataItems.push(pimLinkDocument);

          const contentfulDocument = createContentfulDocument({
            brand: "AeroDek"
          });

          inputDataItems.push(contentfulDocument);

          const result = filterDocuments(inputDataItems, [
            createBrandFilterCriteria()
          ]);

          const expectedResults: (PIMDocument | DocumentData)[] = Array<
            PIMDocument | DocumentData
          >();
          expectedResults.push(pimDocument);
          expectedResults.push(pimLinkDocument);
          expectedResults.push(contentfulDocument);

          expect(result).toEqual(expectedResults);
        });
      });
      describe("And PIM document with multiple brands matching filter exists", () => {
        it("Then: returns result when filtered by any of the brand names", () => {
          const inputDataItems: (PIMDocument | DocumentData)[] = Array<
            PIMDocument | DocumentData
          >();

          const baseUrl = "http://localhost/document/library/";

          const pimDocument = createPimDocument({
            id: `pim-doc-id-aero`,
            url: `${baseUrl}pim-doc-url-aero`,
            productFilters: [
              {
                filterCode: "Brand",
                value: "AeroDek",
                code: "Brand"
              },
              {
                filterCode: "Brand",
                value: "Icopal",
                code: "Brand"
              },
              {
                filterCode: "Brand",
                value: "some-other",
                code: "Brand"
              }
            ],
            productCategories: []
          });
          inputDataItems.push(pimDocument);

          let result = filterDocuments(inputDataItems, [
            createBrandFilterCriteria({
              value: ["AeroDek"]
            })
          ]);

          let expectedResults: (PIMDocument | DocumentData)[] = Array<
            PIMDocument | DocumentData
          >();
          expectedResults.push(pimDocument);

          expect(result).toEqual(expectedResults);

          // search for 'document with Icopal Brand
          result = filterDocuments(inputDataItems, [
            createBrandFilterCriteria({
              value: ["Icopal"]
            })
          ]);

          expectedResults = Array<PIMDocument | DocumentData>();
          expectedResults.push(pimDocument);

          expect(result).toEqual(expectedResults);

          // search for 'document with both AeroDek and Icopal Brands
          result = filterDocuments(inputDataItems, [
            createBrandFilterCriteria({
              value: ["AeroDek", "Icopal"]
            })
          ]);

          expectedResults = Array<PIMDocument | DocumentData>();
          expectedResults.push(pimDocument);

          expect(result).toEqual(expectedResults);
        });
      });
      describe("And PIM Link document with multiple brands matching filter exists", () => {
        it("Then: returns result when filtered by any of the brand names", () => {
          const inputDataItems: (PIMDocument | DocumentData)[] = Array<
            PIMDocument | DocumentData
          >();

          const baseUrl = "http://localhost/document/library/";

          const pimLinkDocument = createPimDocument({
            id: `pim-doc-id-ico`,
            url: `${baseUrl}pim-doc-url-ico`,
            isLinkDocument: true,
            productFilters: [
              {
                filterCode: "Brand",
                value: "AeroDek",
                code: "Brand"
              },
              {
                filterCode: "Brand",
                value: "Icopal",
                code: "Brand"
              }
            ],
            productCategories: []
          });

          inputDataItems.push(pimLinkDocument);

          let result = filterDocuments(inputDataItems, [
            createBrandFilterCriteria({
              value: ["AeroDek"]
            })
          ]);

          let expectedResults: (PIMDocument | DocumentData)[] = Array<
            PIMDocument | DocumentData
          >();
          expectedResults.push(pimLinkDocument);

          expect(result).toEqual(expectedResults);

          // search for 'document with Icopal Brand
          result = filterDocuments(inputDataItems, [
            createBrandFilterCriteria({
              value: ["Icopal"]
            })
          ]);

          expectedResults = Array<PIMDocument | DocumentData>();
          expectedResults.push(pimLinkDocument);

          expect(result).toEqual(expectedResults);

          // search for 'document with both AeroDek and Icopal Brands
          result = filterDocuments(inputDataItems, [
            createBrandFilterCriteria({
              value: ["AeroDek", "Icopal"]
            })
          ]);

          expectedResults = Array<PIMDocument | DocumentData>();
          expectedResults.push(pimLinkDocument);

          expect(result).toEqual(expectedResults);
        });
      });
    });

    describe("When brand filter is provided with Contentful Documents", () => {
      describe("And document with matching filter does NOT exists", () => {
        it("Then: returns empty results", () => {
          const inputDataItems: (PIMDocument | DocumentData)[] = Array<
            PIMDocument | DocumentData
          >();

          const contenfulDocument1 = createContentfulDocument({
            id: `contentful-doc-id`
          });

          inputDataItems.push(contenfulDocument1);

          const contenfulDocument2 = createContentfulDocument({
            id: `contentful-doc-id`,
            brand: "Icopal"
          });

          inputDataItems.push(contenfulDocument2);

          const result = filterDocuments(inputDataItems, [
            createBrandFilterCriteria()
          ]);

          expect(result).toEqual([]);
        });
      });
      describe("And document with matching filter exists", () => {
        it("Then: returns filtered results", () => {
          const inputDataItems: (PIMDocument | DocumentData)[] = Array<
            PIMDocument | DocumentData
          >();

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

          const result = filterDocuments(inputDataItems, [
            createBrandFilterCriteria({ value: ["AeroDek", "Icopal"] })
          ]);

          const expectedResults: (PIMDocument | DocumentData)[] = Array<
            PIMDocument | DocumentData
          >();
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
          const inputDataItems: (PIMDocument | DocumentData)[] = Array<
            PIMDocument | DocumentData
          >();

          const baseUrl = "http://localhost/document/library/";

          const pimDocument = createPimDocument({
            id: `pim-doc-id-aero`,
            url: `${baseUrl}pim-doc-url-aero`,
            productFilters: [],
            productCategories: []
          });

          inputDataItems.push(pimDocument);

          const pimLinkDocument = createPimDocument({
            id: `pim-doc-id-ico`,
            url: `${baseUrl}pim-doc-url-ico`,
            isLinkDocument: true,
            productFilters: [],
            productCategories: []
          });

          inputDataItems.push(pimLinkDocument);

          const result = filterDocuments(inputDataItems, [
            createProductFamilyFilterCriteria()
          ]);

          expect(result).toEqual([]);
        });
      });
      describe("And document with matching filter does NOT exists", () => {
        it("Then: returns empty results", () => {
          const inputDataItems: (PIMDocument | DocumentData)[] = Array<
            PIMDocument | DocumentData
          >();

          const baseUrl = "http://localhost/document/library/";

          const pimDocument = createPimDocument({
            id: `pim-doc-id-aero`,
            url: `${baseUrl}pim-doc-url-aero`,
            productFilters: [
              {
                filterCode: "Brand",
                value: "NOT_EXIST",
                code: "Brand"
              },
              {
                filterCode: "ProductFamily",
                value: "AeroDek_Quadro_Plus_2",
                code: "ProductFamily"
              }
            ],
            productCategories: []
          });

          inputDataItems.push(pimDocument);

          const pimLinkDocument = createPimDocument({
            id: `pim-doc-id-ico`,
            url: `${baseUrl}pim-doc-url-ico`,
            isLinkDocument: true,
            productFilters: [
              {
                filterCode: "Brand",
                value: "ICOPAL",
                code: "Brand"
              },
              {
                filterCode: "ProductFamily",
                value: "AeroDek_Quadro_Plus_2",
                code: "ProductFamily"
              }
            ],
            productCategories: []
          });

          inputDataItems.push(pimLinkDocument);

          const contentfulDocument = createContentfulDocument();

          inputDataItems.push(contentfulDocument);

          const result = filterDocuments(inputDataItems, [
            createProductFamilyFilterCriteria()
          ]);

          expect(result).toEqual([]);
        });
      });
      describe("And document with single productFamily matching filter exists", () => {
        it("Then: returns filtered results", () => {
          const inputDataItems: (PIMDocument | DocumentData)[] = Array<
            PIMDocument | DocumentData
          >();

          const baseUrl = "http://localhost/document/library/";

          const pimDocument = createPimDocument({
            id: `pim-doc-id-aero`,
            url: `${baseUrl}pim-doc-url-aero`,
            productFilters: [
              {
                filterCode: "ProductFamily",
                value: "AeroDek_Quadro_Plus",
                code: "ProductFamily"
              }
            ],
            productCategories: []
          });

          inputDataItems.push(pimDocument);

          const pimLinkDocument = createPimDocument({
            id: `pim-doc-id-ico`,
            url: `${baseUrl}pim-doc-url-ico`,
            isLinkDocument: true,
            productFilters: [
              {
                filterCode: "ProductFamily",
                value: "AeroDek_Quadro_Plus",
                code: "ProductFamily"
              }
            ],
            productCategories: []
          });

          inputDataItems.push(pimLinkDocument);

          const pimLinkDocument2 = createPimDocument({
            id: `pim-doc-id-ico`,
            url: `${baseUrl}pim-doc-url-ico`,
            isLinkDocument: true,
            productFilters: [
              {
                filterCode: "ProductFamily",
                value: "AeroDek_Quadro_Plus_2",
                code: "ProductFamily"
              }
            ],
            productCategories: []
          });

          inputDataItems.push(pimLinkDocument2);

          const result = filterDocuments(inputDataItems, [
            createProductFamilyFilterCriteria()
          ]);

          const expectedResults: (PIMDocument | DocumentData)[] = Array<
            PIMDocument | DocumentData
          >();
          expectedResults.push(pimDocument);
          expectedResults.push(pimLinkDocument);

          expect(result).toEqual(expectedResults);
        });
      });
      describe("And PIM documents with multiple productFamily matching filter exists", () => {
        it("Then: returns filtered results", () => {
          const inputDataItems: (PIMDocument | DocumentData)[] = Array<
            PIMDocument | DocumentData
          >();

          const baseUrl = "http://localhost/document/library/";

          const pimDocument = createPimDocument({
            id: `pim-doc-id-aero`,
            url: `${baseUrl}pim-doc-url-aero`,
            productFilters: [
              {
                filterCode: "ProductFamily",
                value: "AeroDek_Quadro_Plus",
                code: "ProductFamily"
              },
              {
                filterCode: "ProductFamily",
                value: "product_family_2",
                code: "ProductFamily"
              }
            ],
            productCategories: []
          });

          inputDataItems.push(pimDocument);

          // when searched with first product family in search filter criteria
          let result = filterDocuments(inputDataItems, [
            createProductFamilyFilterCriteria({
              value: ["AeroDek_Quadro_Plus"]
            })
          ]);

          const expectedResults: (PIMDocument | DocumentData)[] = Array<
            PIMDocument | DocumentData
          >();
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

          // when searched with related product product family in search filter criteria
          result = filterDocuments(inputDataItems, [
            createProductFamilyFilterCriteria({
              value: ["product_family_4"]
            })
          ]);

          expect(result).toEqual([]);
        });
      });
      describe("And PIM LINK documents with multiple product family matching filter exists", () => {
        it("Then: returns filtered results", () => {
          const inputDataItems: (PIMDocument | DocumentData)[] = Array<
            PIMDocument | DocumentData
          >();

          const baseUrl = "http://localhost/document/library/";

          const pimLinkDocument = createPimDocument({
            id: `pim-doc-id-ico`,
            url: `${baseUrl}pim-doc-url-ico`,
            isLinkDocument: true,
            productFilters: [
              {
                filterCode: "ProductFamily",
                value: "AeroDek_Quadro_Plus",
                code: "ProductFamily"
              },
              {
                filterCode: "ProductFamily",
                value: "product_family_2",
                code: "ProductFamily"
              }
            ],
            productCategories: []
          });

          inputDataItems.push(pimLinkDocument);

          // when searched with first product family in search filter criteria
          let result = filterDocuments(inputDataItems, [
            createProductFamilyFilterCriteria({
              value: ["AeroDek_Quadro_Plus"]
            })
          ]);

          const expectedResults: (PIMDocument | DocumentData)[] = Array<
            PIMDocument | DocumentData
          >();
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
          const inputDataItems: (PIMDocument | DocumentData)[] = Array<
            PIMDocument | DocumentData
          >();

          const contenfulDocument1 = createContentfulDocument({
            id: `contentful-doc-id`
          });

          inputDataItems.push(contenfulDocument1);

          const contenfulDocument2 = createContentfulDocument({
            id: `contentful-doc-id`
          });

          inputDataItems.push(contenfulDocument2);

          const result = filterDocuments(inputDataItems, [
            createAssetTypeFilterCriteria()
          ]);

          expect(result).toEqual([]);
        });
      });
      describe("And document with matching filter exists", () => {
        it("Then: returns filtered results", () => {
          const inputDataItems: (PIMDocument | DocumentData)[] = Array<
            PIMDocument | DocumentData
          >();

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

          const result = filterDocuments(inputDataItems, [
            createAssetTypeFilterCriteria({ value: ["AeroDek_Quadro_Plus"] })
          ]);

          const expectedResults: (PIMDocument | DocumentData)[] = Array<
            PIMDocument | DocumentData
          >();
          expectedResults.push(contenfulDocument1);
          expectedResults.push(contenfulDocument2);

          expect(result).toEqual(expectedResults);
        });
      });
    });
  });
});
