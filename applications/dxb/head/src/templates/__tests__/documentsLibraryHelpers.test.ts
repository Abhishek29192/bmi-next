import { compileESQuery } from "../documentLibrary/helpers/documentsLibraryHelpers";

describe("compileESQuery tests", () => {
  describe("when assetTypes is null", () => {
    it("does not generate asset type filter in Query", () => {
      const generatedQuery = compileESQuery([], 1, "ALL", "Simple", null);

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
        from: 24,
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
        size: 24,
        sort: [
          {
            "title.keyword": "asc"
          }
        ]
      };

      expect(generatedQuery).toEqual(expectedQuery);
    });
  });
  describe("when assetTypes is empty array", () => {
    it("does not generate asset type filter in Query", () => {
      const generatedQuery = compileESQuery([], 1, "ALL", "Simple", []);

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
        from: 24,
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
        size: 24,
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
      const generatedQuery = compileESQuery([], 1, "ALL", "Simple", [
        {
          pimCode: "PIM_CODE_1",
          name: "PIM_CODE_NAME",
          code: "CODE_1",
          description: null
        },
        {
          pimCode: "PIM_CODE_2",
          name: "PIM_CODE_2_NAME",
          code: "CODE_2",
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
        from: 24,
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
                  "assetType.code.keyword": ["CODE_1", "CODE_2"]
                }
              }
            ]
          }
        },
        size: 24,
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
