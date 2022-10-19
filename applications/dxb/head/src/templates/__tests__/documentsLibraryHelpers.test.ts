import { compileESQuery } from "../documentLibrary/helpers/documentsLibraryHelpers";

describe("compileESQuery tests", () => {
  describe("when assetTypes is null", () => {
    it("does not generate asset type filter in Query", () => {
      const generatedQuery = compileESQuery([], 1, 10, "", "", null);

      const expectedQuery = {
        aggs: {
          unique_documents_count: {
            cardinality: {
              field: "titleAndSize.keyword"
            }
          }
        },
        collapse: {
          field: "titleAndSize.keyword"
        },
        from: 10,
        query: {
          bool: {
            must: [
              {
                term: {
                  noIndex: {
                    value: false
                  }
                }
              }
            ]
          }
        },
        size: 10,
        sort: [
          {
            "title.keyword": "asc"
          }
        ]
      };

      expect(generatedQuery).toEqual(expectedQuery);
    });
  });
  describe("when assetTypes is empty arary", () => {
    it("does not generate asset type filter in Query", () => {
      const generatedQuery = compileESQuery([], 1, 10, "", "", []);

      const expectedQuery = {
        aggs: {
          unique_documents_count: {
            cardinality: {
              field: "titleAndSize.keyword"
            }
          }
        },
        collapse: {
          field: "titleAndSize.keyword"
        },
        from: 10,
        query: {
          bool: {
            must: [
              {
                term: {
                  noIndex: {
                    value: false
                  }
                }
              }
            ]
          }
        },
        size: 10,
        sort: [
          {
            "title.keyword": "asc"
          }
        ]
      };

      expect(generatedQuery).toEqual(expectedQuery);
    });
  });

  describe("when assetTypes is provided", () => {
    it("generates asset type filter in Query", () => {
      const generatedQuery = compileESQuery([], 1, 10, "", "", [
        {
          pimCode: "PIM_CODE_1",
          __typename: "ContentfulAssetType",
          id: "1",
          name: "PIM_CODE_NAME",
          code: "PIM_CD",
          description: null
        },
        {
          pimCode: "PIM_CODE_2",
          __typename: "ContentfulAssetType",
          id: "2",
          name: "PIM_CODE_2_NAME",
          code: "PIM_CD",
          description: null
        }
      ]);

      const expectedQuery = {
        aggs: {
          unique_documents_count: {
            cardinality: {
              field: "titleAndSize.keyword"
            }
          }
        },
        collapse: {
          field: "titleAndSize.keyword"
        },
        from: 10,
        query: {
          bool: {
            must: [
              {
                term: {
                  noIndex: {
                    value: false
                  }
                }
              },
              {
                terms: {
                  "assetType.pimCode.keyword": ["PIM_CODE_1", "PIM_CODE_2"]
                }
              }
            ]
          }
        },
        size: 10,
        sort: [
          {
            "title.keyword": "asc"
          }
        ]
      };

      expect(generatedQuery).toEqual(expectedQuery);
    });
  });
});
